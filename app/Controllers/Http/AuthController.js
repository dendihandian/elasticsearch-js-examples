'use strict'

const User = use('App/Models/User')

class AuthController {
  async register ({ request, auth, response }) {
    const userData = request.only(['username', 'email', 'password'])

    try {
      const user = await User.create(userData)

      const token = await auth.generate(user)

      return response.status(200).json({
        message: 'Register Successful',
        data: {
          user: user,
          token: token.token
        }
      })
    } catch (error) {
      let message = 'An Error Occured'

      if (error.errno == 19) {
        message = 'User Already Exist'
      }

      return response.status(400).json({
        message: message
      })
    }
  }

  async login ({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const token = await auth.attempt(email, password)

      return response.status(200).json({
        message: 'Login Successful',
        data: {
          user: auth.getUser(),
          token: token.token
        }
      })
    } catch (error) {
      response.status(400).json({
        message: 'Invalid Email / Password.'
      })
    }
  }

  async user ({ auth, response }) {
    return response.json({
      message: 'User Detail',
      data: auth.user
    })
  }

  async logout ({ auth, response }) {
    try {
      await auth.logout()

      return response.status(200).json({
        message: 'Logout Successful',
        data: null
      })
    } catch (error) {
      return response.status(400).json({
        message: 'An Error Occured',
        data: null
      })
    }
  }
}

module.exports = AuthController
