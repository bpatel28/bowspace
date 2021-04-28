function User({
  UserId,
  FirstName,
  LastName,
  MiddleName,
  Email,
  UserName,
  Token,
  ValidFrom,
}) {
  this.UserId = UserId || -1;
  this.FirstName = FirstName || "";
  this.LastName = LastName || "";
  this.MiddleName = MiddleName || "";
  this.Email = Email || "";
  this.UserName = UserName || "";
  this.Token = Token || "";
  this.ValidFrom = ValidFrom || "";
}

module.exports = User;
