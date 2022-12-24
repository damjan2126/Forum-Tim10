import uuid

from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql.operators import ColumnOperators

import loggerFactory
from db import db
from models import ThemeModel, CommentModel, ThemesAndSubs
from models.ratingTheme import ThemeRatingModel
from schemas import CreateThemeSchema, ThemeSchema, ThemeOptionSchema, CommentSchema, ThemeWithCommentsSchema, \
    PlainThemeRateSchema
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy import func, desc

blp = Blueprint("themes", __name__, description="Operations on themes")

logger = loggerFactory.get_module_logger(__name__)


@blp.route("/theme/all/<string:sort_by>")
class Themes(MethodView):
    @blp.response(200, ThemeSchema(many=True))
    @jwt_required()
    def get(self, sort_by):
        if sort_by == "likeDesc":
            themes = ThemeModel.query.order_by(desc(ThemeModel.like_count)).all()
        elif sort_by == "likeAsc":
            themes = ThemeModel.query.order_by(ThemeModel.like_count).all()
        elif sort_by == "dislikeDesc":
            themes = ThemeModel.query.order_by(desc(ThemeModel.dislike_count)).all()
        elif sort_by == "dislikeAsc":
            themes = ThemeModel.query.order_by(ThemeModel.dislike_count).all()
        elif sort_by == "commentDesc":
            themes = ThemeModel.query.order_by(desc(ThemeModel.comment_count)).all()
        elif sort_by == "commentsAsc":
            themes = ThemeModel.query.order_by(ThemeModel.comment_count).all()

        if not themes:
            abort(404, message="Query input not recognized")

        user_id = get_jwt()["sub"]

        subbed_themes = ThemesAndSubs.query.filter_by(sub_id=user_id).all()
        theme_ids = [theme.theme_id for theme in subbed_themes]

        for theme in themes:

            if theme.id in theme_ids:
                theme.subbed = True
            else:
                theme.subbed = False

        return themes


@blp.route("/theme/all/search/<string:theme_title>")
class ThemeSearch(MethodView):
    @blp.response(200, ThemeSchema(many=True))
    @jwt_required()
    def get(self, theme_title):
        themes = (
            ThemeModel.query
            .filter(ColumnOperators.like(ThemeModel.title, f"%{theme_title}%"))
            .all()
        )
        return themes


@blp.route("/theme/create")
class CreateTheme(MethodView):

    @blp.arguments(CreateThemeSchema)
    @blp.response(201, CreateThemeSchema)
    @jwt_required()
    def post(self, theme_data):
        user_id = get_jwt().get("sub")

        new_theme = ThemeModel(**theme_data)
        new_theme.id = uuid.uuid4().hex
        new_theme.owner_id = user_id

        try:
            db.session.add(new_theme)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE CREATE THEME POST")
            logger.error(error)
            abort(500, message="An error occurred while inserting the item.")

        return new_theme


@blp.route("/theme/subscribe/<string:theme_id>")
class ThemeSubscribe(MethodView):
    @blp.response(201)
    @jwt_required()
    def post(self, theme_id):
        user_id = get_jwt()["sub"]
        id = uuid.uuid4().hex
        theme = ThemeModel.query.get_or_404(theme_id)

        if not theme:
            abort(404, message="Theme with that id not found")
        elif theme.owner_id == user_id:
            abort(403, message="Cannot subscribe to the theme user id is owner of")

        new_sub = ThemesAndSubs()
        new_sub.id = id
        new_sub.sub_id = user_id
        new_sub.theme_id = theme.id

        try:
            db.session.add(new_sub)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE THEME SUBSCRIBE POST")
            logger.error(error)
            abort(500, message="An error occurred while inserting new sub to the theme.")

        return


@blp.route("/theme/rate/<string:theme_id>")
class ThemeRate(MethodView):

    @blp.response(201)
    @blp.arguments(PlainThemeRateSchema)
    @jwt_required()
    def post(self, rating_data, theme_id):
        user_id = get_jwt()["sub"]
        theme_rating = ThemeRatingModel.query.filter(
            ThemeRatingModel.theme_id == theme_id,
            ThemeRatingModel.user_id == user_id,
            ThemeRatingModel.rating == rating_data["rating"]
        ).first()
        if theme_rating:
            rating = theme_rating.rating

            try:
                db.session.delete(theme_rating)
                db.session.commit()

            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE THEME RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while deleting existing theme rating.")

            theme = ThemeModel.query.get(theme_id)

            if rating:
                theme.like_count -= 1
            else:
                theme.dislike_count -= 1

            try:
                db.session.add(theme)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE THEME RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while updating existing theme with deleted rating.")

            return "Success"

        theme_rating = ThemeRatingModel.query.filter(
            ThemeRatingModel.theme_id == theme_id,
            ThemeRatingModel.user_id == user_id
        ).first()

        theme = ThemeModel.query.get(theme_id)
        if theme_rating:
            theme_rating.rating = rating_data["rating"]
            try:
                db.session.add(theme_rating)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE THEME RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while updating existing theme rating.")

            if rating_data["rating"]:
                theme.like_count += 1
                theme.dislike_count -= 1
            else:
                theme.like_count -= 1
                theme.dislike_count += 1

        else:
            new_rating = ThemeRatingModel(**rating_data)
            new_rating.id = uuid.uuid4().hex
            new_rating.theme_id = theme_id
            new_rating.user_id = user_id

            try:
                db.session.add(new_rating)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED THEME RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while creating new theme rating.")

            if rating_data["rating"]:
                theme.like_count += 1
            else:
                theme.dislike_count += 1

        try:
            db.session.add(theme)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE THEME RATE POST")
            logger.error(error)
            abort(500, message="An error occurred while changing existing theme rating.")

        return "Success"


@blp.route("/theme/<string:theme_id>")
class Theme(MethodView):
    @blp.response(200, ThemeWithCommentsSchema)
    @jwt_required()
    def get(self, theme_id):
        theme = ThemeModel.query.filter_by(id=theme_id).first()
        themeToReturn = ThemeWithCommentsSchema()
        themeToReturn.id = theme.id
        themeToReturn.owner_id = theme.owner_id
        themeToReturn.comments = (
            db.session.query(CommentModel)
            .filter_by(themeId=theme.id)
            .order_by(CommentModel.createdAt)
            .all()
        )

        themeToReturn.owner = theme.owner
        themeToReturn.open = theme.open
        themeToReturn.title = theme.title

        return themeToReturn

    @blp.response(200)
    @jwt_required()
    def delete(self, theme_id):
        theme = ThemeModel.query.get(theme_id)

        if not theme:
            abort(404, message="Theme id not found")

        if not theme.owner_id == get_jwt()["sub"]:
            abort(403, message="User is not owner of theme")

        try:
            db.session.delete(theme)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE THEME DELETE")
            logger.error(error)
            abort(500, message="An error occurred while deleting the theme.")

        return {"message": "Theme deleted"}, 200

    @blp.arguments(ThemeOptionSchema)
    @blp.response(200, ThemeSchema)
    @jwt_required()
    def patch(self, theme_data, theme_id):
        theme = ThemeModel.query.get_or_404(theme_id)

        if not theme.owner_id == get_jwt()["sub"]:
            abort(403, message="You are not the owner")

        theme.open = theme_data["open"]

        try:
            db.session.add(theme)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE THEME PATCH")
            logger.error(error)
            abort(500, message="An error occurred while patching the theme.")

        return theme

    @blp.arguments(CommentSchema)
    @blp.response(200, CommentSchema)
    @jwt_required()
    def post(self, comment_data, theme_id):
        theme = ThemeModel.query.get_or_404(theme_id)
        user_id = get_jwt()["sub"]
        if not theme.open:
            abort(403, message="Cant comment on closed theme")

        new_comment = CommentModel(**comment_data)
        new_comment.id = uuid.uuid4().hex
        new_comment.authorId = user_id
        new_comment.themeId = theme.id
        new_comment.createdAt = func.now()

        try:
            db.session.add(new_comment)
            db.session.commit()
            theme.comment_count += 1
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE THEME POST")
            logger.error(error)
            abort(500, message="An error occurred while creating comment.")

        return new_comment
