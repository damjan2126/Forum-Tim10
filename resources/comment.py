import uuid

from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError

import loggerFactory
from db import db
from models import ThemeModel, CommentModel
from models.ratingComment import RatingCommentModel
from models.ratingTheme import ThemeRatingModel
from schemas import PlainCommentSchema, PlainCommentRateSchema
from flask_jwt_extended import jwt_required, get_jwt

blp = Blueprint("comments", __name__, description="Operations on comments")

logger = loggerFactory.get_module_logger(__name__)

@blp.route("/comment/<string:comment_id>/<string:user_id>/<string:rating>")
class CommentRateMail(MethodView):
    @blp.response(201)
    def get(self, comment_id, user_id, rating):
        if rating == "Like":
            rating_bool = True
        else:
            rating_bool = False
        logger.info(1)
        comment_rating = RatingCommentModel.query.filter(
            RatingCommentModel.comment_id == comment_id,
            RatingCommentModel.user_id == user_id,
            RatingCommentModel.rating == rating_bool
        ).first()
        logger.info(2)
        if comment_rating:
            logger.info(3)
            rating = comment_rating.rating

            try:
                db.session.delete(comment_rating)
                db.session.commit()

            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE COMMENT POST")
                logger.error(error)
                abort(500, message="An error occurred while deleting existing comment rating.")

            comment = CommentModel.query.get(comment_id)

            if rating:
                comment.like_count -= 1
            else:
                comment.dislike_count -= 1

            try:
                db.session.add(comment)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE COMMENT RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while updating existing comment with deleted rating.")

            return "Success"
        logger.info(4)
        comment_rating = RatingCommentModel.query.filter(
            RatingCommentModel.comment_id == comment_id,
            RatingCommentModel.user_id == user_id
        ).first()
        logger.info(5)
        comment = CommentModel.query.get(comment_id)
        if comment_rating:
            comment_rating.rating = rating_bool
            try:
                db.session.add(comment_rating)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE COMMENT RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while updating existing comment rating.")

            if rating_bool:
                comment.like_count += 1
                comment.dislike_count -= 1
            else:
                comment.like_count -= 1
                comment.dislike_count += 1

        else:
            logger.info(6)
            new_rating = RatingCommentModel()
            new_rating.id = uuid.uuid4().hex
            new_rating.comment_id = comment_id
            new_rating.user_id = user_id
            new_rating.rating = rating_bool

            try:
                db.session.add(new_rating)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED COMMENT RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while creating new comment rating.")

            if rating_bool:
                comment.like_count += 1
            else:
                comment.dislike_count += 1

        try:
            db.session.add(comment)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE COMMENT RATE POST")
            logger.error(error)
            abort(500, message="An error occurred while changing existing comment rating.")

        return



@blp.route("/comment/<string:comment_id>")
class Comments(MethodView):
    @blp.arguments(PlainCommentSchema)
    @blp.response(201)
    @jwt_required()
    def put(self, comment_data, comment_id):
        user_id = get_jwt()["sub"]
        comment = CommentModel.query.get_or_404(comment_id)

        if user_id != comment.authorId:
            abort(403, message="Cannot edit another users comment")

        comment.commentText = comment_data["commentText"]

        try:
            db.session.add(comment)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE COMMENT PUT")
            logger.error(error)
            abort(500, "Internal server error; Check logs")

        return

    @blp.arguments(PlainCommentRateSchema)
    @blp.response(201)
    @jwt_required()
    def post(self, rate_data, comment_id):
        user_id = get_jwt()["sub"]
        comment_rating = RatingCommentModel.query.filter(
            RatingCommentModel.comment_id == comment_id,
            RatingCommentModel.user_id == user_id,
            RatingCommentModel.rating == rate_data["rating"]
        ).first()

        if comment_rating:
            rating = comment_rating.rating

            try:
                db.session.delete(comment_rating)
                db.session.commit()

            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE COMMENT POST")
                logger.error(error)
                abort(500, message="An error occurred while deleting existing comment rating.")

            comment = CommentModel.query.get(comment_id)

            if rating:
                comment.like_count -= 1
            else:
                comment.dislike_count -= 1

            try:
                db.session.add(comment)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE COMMENT RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while updating existing comment with deleted rating.")

            return "Success"

        comment_rating = RatingCommentModel.query.filter(
            RatingCommentModel.comment_id == comment_id,
            RatingCommentModel.user_id == user_id
        ).first()

        comment = CommentModel.query.get(comment_id)
        if comment_rating:
            comment_rating.rating = rate_data["rating"]
            try:
                db.session.add(comment_rating)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED INSIDE COMMENT RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while updating existing comment rating.")

            if rate_data["rating"]:
                comment.like_count += 1
                comment.dislike_count -= 1
            else:
                comment.like_count -= 1
                comment.dislike_count += 1

        else:
            new_rating = RatingCommentModel(**rate_data)
            new_rating.id = uuid.uuid4().hex
            new_rating.comment_id = comment_id
            new_rating.user_id = user_id

            try:
                db.session.add(new_rating)
                db.session.commit()
            except SQLAlchemyError as error:
                logger.error("EXCEPTION HAPPENED COMMENT RATE POST")
                logger.error(error)
                abort(500, message="An error occurred while creating new comment rating.")

            if rate_data["rating"]:
                comment.like_count += 1
            else:
                comment.dislike_count += 1

        try:
            db.session.add(comment)
            db.session.commit()
        except SQLAlchemyError as error:
            logger.error("EXCEPTION HAPPENED INSIDE COMMENT RATE POST")
            logger.error(error)
            abort(500, message="An error occurred while changing existing comment rating.")

        return
