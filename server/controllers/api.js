const mongoose = require('mongoose')
const User = mongoose.model('User')


module.exports.signup = async (ctx, next) => {
  const {
    email,
    password,
    confirm,
    nickname
  } = ctx.request.body

  ctx.checkBody('email').isEmail("you enter a bad email.");
  ctx.checkBody('password').notEmpty().len(6, 20).md5();
  ctx.checkBody('confirm').eq(password, '两次输入的密码不一致');
  ctx.checkBody('nickname').optional().len(2, 20,"nickname为2-20字节");

  console.log(ctx.errors)
  if (ctx.errors) {
    const err = JSON.stringify(ctx.errors[0])
    ctx.body = {
      success: false,
      err
    };
    return;
  }

  let user = await User.findOne({
    email
  }).exec()

  if (!user) {
    user = new User({
      email,
      password,
      nickname
    })

    await user.save()
    return ctx.body = {
      success: true,
    }
  } else {
    return ctx.body = {
      success: false,
      err: '用户已存在'
    }
  }


}
