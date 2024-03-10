"use strict"

import User from "./user.model.js"
import { checkPassword, encrypt, checkUpdate } from "../utils/validator.js"
import { generateJWT } from "../utils/jwt.js"
import { validateJwt } from "../middlewares/validate.jwt.js"
import { hash } from "bcrypt"

export const test = (req, res) => {
  return res.send("Hello world")
}

export const register = async (req, res) => {
  try {
    let data = req.body

    if (!data.username && !data.email) {
      return res.status(400).send({ message: "Username or email is required for registration" })
    }

    if (data.username) {
      const existingUsername = await User.findOne({ username: data.username })
      if (existingUsername) {
        return res.status(400).send({ message: "Username is already taken" })
      }
    }

    if (data.email) {
      const existingEmail = await User.findOne({ email: data.email })
      if (existingEmail) {
        return res.status(400).send({ message: "Email is already registered" })
      }
    }

    data.password = await encrypt(data.password)
    data.role = "CLIENT"
    let user = new User(data)
    await user.save()

    return res.send({ message: "Registered successfully" })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: "Error registering user ", err })
  }
}

export const login = async (req, res) => {
  try {
    let { username, email, password } = req.body

    if (!username && !email) {
      return res.status(400).send({ message: "Username or email is required for login" })
    }

    let user

    if (username) {
      user = await User.findOne({ username })
    } else if (email) {
      user = await User.findOne({ email })
    }

    if (user && (await checkPassword(password, user.password))) {
      let loggedUser = {
        uid: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      }

      let token = await generateJWT(loggedUser)
      return res.send({ message: `Welcome ${user.name}`, loggedUser, token })
    }

    return res.status(404).send({ message: "Invalid Credentials" })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: "Error logging in" })
  }
}

export const defaultAdmin = async () => {
  try {
    const userExist = await User.findOne({ username: 'default' })

    if (userExist) {
      console.log('The admin user "default" already exists')
      return
    }
    let data = {
      name: 'Default',
      surname: 'Defaultt',
      email:'Default',
      username: 'default',
      password: await encrypt('12345678'),
      phone: '12345678',
      address: 'defaultadmin@gmail.com',
     role: 'ADMIN', 
    }
    let user = new User(data)
    await user.save()

    console.log('The admin user "default" has been created')
  } catch (err) {
    console.error(err)
  }
}



export const update = async (req, res) => {
  try {
    let { id } = req.params
    let data = req.body
    let update = checkUpdate(data, id)
    console.log("The user id is ", id)
    let idToken = req.uid
    console.log("The user id by token is ", idToken)

    if (id !== idToken) {
      return res.send({ message: "You can only update your user data." })
    }

    if (!update) {
      return res.status(400).send({
        message: "Have submitted some data that cannot be updated or missing data",
      })
    }

    let updateUser = await User.findOneAndUpdate({ _id: id }, data, {
      new: true,
    })

    if (!updateUser) {
      return res.status(400).send({ message: "User not found and not updated" })
    }

    return res.send({ message: "Update user", updateUser })
  } catch (err) {
    console.error(err)

    if (err.keyValue.username) {
      return res.status(400).send({
        message: `Username ${err.keyValue.username} is already taken`,
      })
    }

    return res.status(500).send({ message: "Error updating account" })
  }
}

export const deleteU = async (req, res) => {
  try {
    let { id } = req.params
    let deletedUser = await User.findOneAndDelete({ _id: id })
    console.log("The user id is ", id)
    let idToken = req.uid
    console.log("The user id by token is ", idToken)

    if (id !== idToken) {
      return res.send({ message: "You can only delete your account." })
    }

    if (!deletedUser) {
      return res.status(404).send({ message: "The account not found and not deleted" })
    }

    return res.send({
      message: `Account whit username ${deletedUser.username} delete successfully`,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: "Error deleting account" })
  }
}


export const defaultClient = async () => {
  try {
    const userExist = await User.findOne({ username: 'defaultclient' })

    if (userExist) {
      console.log('The client user "defaultclient" already exists')
      return
    }
    let data = {
      name: 'Default',
      surname: 'Client',
      email: 'defaultclient@gmail.com',
      username: 'defaultclient',
      password: await encrypt('12345678'),
      phone: '12345678',
      address: 'Default Address',
      role: 'CLIENT',
    }
    let user = new User(data)
    await user.save()
    console.log('The client user "defaultclient" has been created')
  } catch (err) {
    console.error(err)
  }
}