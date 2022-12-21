from marshmallow import Schema, fields


class PlainUserSchema(Schema):
    id = fields.Int(dump_only=True)
    firstName = fields.Str(required=True)
    lastName = fields.Str(required=True)
    address = fields.Str(required=True)
    city = fields.Str(required=True)
    country = fields.Str(required=True)
    phoneNumber = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True)


class UpdateUser(Schema):
    id = fields.Int(required=True)
    firstName = fields.Str()
    lastName = fields.Str()
    address = fields.Str()
    city = fields.Str()
    country = fields.Str()
    phoneNumber = fields.Str()

class PlainThemeSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)

class ThemeSchema(PlainThemeSchema):
    user_id = fields.Int(required=True, load_only=True)
    user = fields.Nested(PlainUserSchema(), dump_only=True)

class UserSchema(PlainUserSchema):
    themes = fields.List(fields.Nested(PlainThemeSchema()), dump_only=True)