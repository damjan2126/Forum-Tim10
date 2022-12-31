from marshmallow import Schema, fields


class PlainCommentSchema(Schema):
    id = fields.Str(dump_only=True)
    createdAt = fields.DateTime(dump_only=True)
    commentText = fields.Str()

class PlainCommentRateSchema(Schema):
    rating = fields.Bool()


class PlainThemeRateSchema(Schema):
    theme_id = fields.Str(dump_only=True)
    user_id = fields.Str(dump_only=True)
    rating = fields.Bool()


class PlainSubscribeSchema(Schema):
    id = fields.Str()
    sub_id = fields.Str()
    theme_id = fields.Str()


class CommentSchema(PlainCommentSchema):
    authorId = fields.Str(dump_only=True)
    themeId = fields.Str(dump_only=True)


class PlainUserSchema(Schema):
    id = fields.Str(dump_only=True)
    firstName = fields.Str(required=True)
    lastName = fields.Str(required=True)
    address = fields.Str(required=True)
    city = fields.Str(required=True)
    country = fields.Str(required=True)
    phoneNumber = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)


class UpdateUserSchema(Schema):
    firstName = fields.Str()
    lastName = fields.Str()
    address = fields.Str()
    city = fields.Str()
    country = fields.Str()
    phoneNumber = fields.Str()


class CreateThemeSchema(Schema):
    id = fields.Str(dump_only=True)
    user_id = fields.Str(dump_only=True)
    title = fields.Str()
    open = fields.Bool()


class UserShortInfoSchema(Schema):
    id = fields.Str(dump_only=True)
    email = fields.Str(dump_only=True)
    country = fields.Str(dump_only=True)
    firstName = fields.Str(dump_only=True)
    lastName = fields.Str(dump_only=True)


class ThemeSchema(Schema):
    id = fields.Str(dump_only=True)
    title = fields.Str(dump_only=True)
    open = fields.Bool(dump_only=True)
    owner_id = fields.Str(dump_only=True)
    owner = fields.Nested(UserShortInfoSchema(), dump_only=True)
    comment_count = fields.Integer(dump_only=True)
    like_count = fields.Int(dump_only=True)
    dislike_count = fields.Int(dump_only=True)
    subbed = fields.Bool(dump_only=True)
    rating = fields.Bool(dump_only=True)


class CommentWithAuthorInfo(PlainCommentSchema):
    authorId = fields.Str(dump_only=True)
    user = fields.Nested(UserShortInfoSchema(), dump_only=True)
    rating = fields.Bool(dump_only=True)
    like_count = fields.Int(dump_only=True)
    dislike_count = fields.Int(dump_only=True)


class ThemeWithCommentsSchema(ThemeSchema):
    comments = fields.List(fields.Nested(CommentWithAuthorInfo()), dump_only=True)


class ThemeOptionSchema(Schema):
    open = fields.Bool()


class UserLoginSchema(Schema):
    email = fields.String()
    password = fields.String()


class UserUpdatePasswordSchema(Schema):
    password = fields.String(load_only=True)


class UserSchema(PlainUserSchema):
    themes = fields.List(fields.Nested(ThemeSchema(), exclude=("owner", "owner_id")))
