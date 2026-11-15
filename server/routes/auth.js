import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { users, newUserId } from '../data/store.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function makeToken(user) {
  return jwt.sign(
    { user_id: user.user_id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' },
  )
}

function publicUser(user) {
  return { user_id: user.user_id, name: user.name, role: user.role }
}

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }
  if (users.find((u) => u.email === email.toLowerCase())) {
    return res.status(409).json({ message: 'This email is already registered' })
  }

  const user = {
    user_id: newUserId(),
    name,
    email: email.toLowerCase(),
    password_hash: bcrypt.hashSync(password, 10),
    role: 'customer',
  }
  users.push(user)

  res.status(201).json({ token: makeToken(user), user: publicUser(user) })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = users.find((u) => u.email === (email || '').toLowerCase())

  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json({ message: 'Wrong email or password' })
  }

  res.json({ token: makeToken(user), user: publicUser(user) })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export default router