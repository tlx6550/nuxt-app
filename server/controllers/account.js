const mongoose = require('mongoose')
const Account = mongoose.model('Account')
const dbHelp = require('../database/dbHelp')
const _ = require('lodash')

module.exports.list = async (ctx, next) => {
  const data = await dbHelp.accountHelp.getAccounts({}, Object.assign({
    sort: '-meta.updatedAt'
  }, ctx.pagination))
  ctx.body = {
    data: data,
    success: true
  }
}


module.exports.create = async (ctx, next) => {
  const {
    name,
    AppID,
    AppSecret
  } = ctx.request.body

  ctx.checkBody('name').notEmpty();
  ctx.checkBody('AppID').notEmpty();
  ctx.checkBody('AppSecret').notEmpty();

  if (ctx.errors) {
    const err = JSON.stringify(ctx.errors[0])
    ctx.body = {
      success: false,
      err
    };
    return;
  }

  let account = await Account.findOne({
    AppID
  }).exec()

  if (!account) {
    account = new Account({
      name,
      AppID,
      AppSecret
    })

    let data = await account.save()
    return ctx.body = {
      success: true,
      data: data
    }
  } else {
    return ctx.body = {
      success: false,
      err: '公众号已存在'
    }
  }
}

module.exports.edit = async (ctx, next) => {
  const {
    _id,
    name,
    AppID,
    AppSecret,
  } = ctx.request.body
  ctx.checkBody('name').notEmpty();
  ctx.checkBody('AppID').notEmpty();
  ctx.checkBody('AppSecret').notEmpty();

  if (ctx.errors) {
    const err = JSON.stringify(ctx.errors[0])
    ctx.body = {
      success: false,
      err
    };
    return;
  }

  let res = await Account.findOne({
    _id
  }).exec()

  let data = await Account.findByIdAndUpdate(_id,
    {
      $set: {
      name,
      AppID,
      AppSecret
    }
    }, { new: true });

  console.log(res)
  return ctx.body = {
    success: true,
    data
  }
}
