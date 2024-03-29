import User from '../models/user.model'
import merge from 'lodash/merge'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import { extend } from 'lodash'
import defaultImage from './../../client/assets/images/profile-pic.png'

const create = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: 'Successfully signed up!'
    })
  } catch (err) {
    return res.status(409).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
  try {
    const users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const userById = async (req, res, next, id) => {
  try {
    const user = await User.findById({ _id: id })
      .populate('following', '_id name')
      .populate('followers', '_id name')
      .exec()

    if (!user) {
      return res.status(400).json({
        error: `User not found ${id}`
      })
    }
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve user'
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  req.name = 'ss'
  return res.json(req.profile)
}

const update = async (req, res) => {
  const form = new formidable.IncomingForm()
  form.keepExtension = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded'
      })
    }
    let user = req.profile
    user = extend(user, fields)
    user.updated = Date.now()

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.filepath)
      user.photo.contentType = files.photo.type
    }

    try {
      let user = req.profile
      user = merge(user, req.body)

      user.updated = Date.now()
      await user.save()
      user.hashed_password = ''
      user.salt = ''

      res.json({ user })
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage('error', err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    const user = req.profile
    const deletedUser = await user.deleteOne()
    deletedUser.hashed_password = ''
    deletedUser.salt = ''
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set('Content-Type', req.profile.photo.buffer)
    return res.send(req.profile.photo.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.sendFile(`${process.cwd()}${defaultImage}`)
}

const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } })
    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addFollower = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
      .populate('following', '_id name')
      .populate('followers', '_id name')
      .exec()
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowID } })
    next()
  } catch (err) {
    console.log()
    return res.status(400).json({
      error: errorHandler.getErrorMessage()
    })
  }
}

const removeFollower = async (req, res) => {
  console.log('server body', req.body);
  try {
    const result = await User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
      .populate('following', '_id name')
      .populate('followers', '_id name')
      .exec()
    console.log('server result', result);
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage()
    })
  }
}

const findPeople = async (req, res) => {
  const following = req.profile.following
  following.push(req.profile._id)
  try {
    const users = await User.find({ _id: { $nin: following } }).select('name')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  list,
  read,
  remove,
  userById,
  update,
  photo,
  defaultPhoto,
  addFollower,
  addFollowing,
  removeFollowing,
  removeFollower,
  findPeople
}
