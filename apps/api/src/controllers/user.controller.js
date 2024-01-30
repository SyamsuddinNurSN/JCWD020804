// Import library yang dibutuhkan
import fs from 'fs';
import handlebars from 'handlebars';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { log } from 'console';
import transporter from '../middleware/transporter';
const path = require('path');

export const createUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const isEmailExist = await User.findOne({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      return res.status(400).send('Email has been used');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      isTenant: false,
      isVerified: false,
    });

    // Ubah path file verifiedakun.html sesuai dengan struktur proyek Anda
    const data = fs.readFileSync('./web/verifiedakun.html', 'utf-8');
    const tempCompile = handlebars.compile(data);
    const tempResult = tempCompile({
      createdAt: newUser.createdAt,
      name: newUser.name,
      username: newUser.username,
      link: `http://localhost:5173/verify/${newUser.id}`,
    });

    // Konfigurasi email yang akan dikirim
    await transporter.sendMail({
      from: 'amanhidayat39@gmail.com',
      to: email,
      subject: 'Email Confirmation',
      html: tempResult,
    });

    return res.status(200).send(newUser);
  } catch (error) {
    console.log(error);
    return { message: error };
  }
};

export const login = async (req) => {
  try {
    let isUserExist;

    const { email, password } = req.body;

    isUserExist = await User.findOne({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      return { error: 'Email not found', status: 'er', code: 400 };
    }

    const passwordMatch = await bcrypt.compare(password, isUserExist.password);

    if (!passwordMatch) {
      return { error: 'Wrong Password', status: 'er', code: 400 };
    }

    // Buat token JWT
    const payload = { id: isUserExist.id };
    const token = jwt.sign(payload, 'LogIn');

    return {
      message: 'Logged in successfully',
      result: isUserExist,
      token,
    };
  } catch (error) {
    console.error('error', error);
    return { error: 'Internal Server Error', status: 'er', code: 500 };
  }
};

export const keepLogin = async (req, res) => {
  try {
    const result = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Internal Server Error' });
  }
};

export const verify = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const result = await User.update(
      { isVerified },
      { where: { id: req.params.id } },
    );

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

export const becomeTenant = async (req, res) => {
  try {
    const { no_ktp } = req.body;
    const userId = req.user.id;

    await User.update(
      {
        isTenant: true,
        no_ktp,
        foto_ktp: req.file?.path,
      },
      {
        where: {
          id: req.user.id,
        },
      },
    );

    // You can send the updated user data as a response
    // res.json({ success: true, user: updatedUser });

    console.log(userId);
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('Error updating user data:', error);
    // res.status(500).json({ success: false, error: 'Internal Server Error' });
    res.status(500).send('NO!');
  }
};

export const userRegisterWithGoogle = async (req, res) => {
  try {
    const { googleUserData } = req.body;
    console.log(googleUserData);

    const findUser = await User.findOne({
      where: {
        firebaseUID: googleUserData?.uid,
      },
    });

    if (findUser == null) {
      // Generate Referral code
      // const generateReferralCode = (name) => {
      //     const words = name.split(' ')
      //     const userChars = words
      //         .map((word) => word.charAt(0).toUpperCase())
      //         .join('');

      //     const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();

      //     const generatedCode = `${userChars}${randomChars}`;

      //     return generatedCode;
      // }

      // const referral = generateReferralCode(googleUserData.displayName)

      // Customer create
      const result = await User.create({
        name: googleUserData.displayName.split(' ')[0] || '',
        username: googleUserData.displayName.split(' ')[1] || '',
        email: googleUserData.email,
        picture: googleUserData.photoURL,

        firebaseUID: googleUserData.uid,
        // referral_code: referral,

        isVerified: true,
      });

      // jwt
      let payload = { id: result.id };
      // const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: `1h` })
      const token = jwt.sign(payload, 'LogIn', { expiresIn: `1h` });

      //
      // const filePath = path.join(__dirname, '../../src/template_verify.html');
      // const data = fs.readFileSync(filePath, 'utf-8');
      // const tempCompile = await handlebars.compile(data)
      // const tempResult = tempCompile({ firstname: googleUserData.displayName, link: `http://localhost:5173/verify/${token}` })

      // await transporter.sendMail({
      //     from: '.com',
      //     to: googleUserData.email,
      //     subject: 'Fresh Finds - Email Verification',
      //     html: tempResult
      // })
      return res.status(200).send({
        message: 'Successfully registering new user with Google Account',
        result: result,
        token,
      });
    } else {
      let payload = { id: findUser.id };
      const token = jwt.sign(payload, 'LogIn', { expiresIn: `1h` });
      console.log(token);

      console.log('Google account is already registered');
      return res.status(200).send({
        message: 'Success Signing in with Google Account',
        result: findUser,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log(`ini req body`, req.body);
    const { email, username, link } = req.body;
    console.log(link, 'ini link loh');
    console.log(username, 'ini username loh');
    console.log(email, 'ini email loh');
    const data = fs.readFileSync('./web/resetpassword.html', 'utf-8');
    const tempCompile = await handlebars.compile(data);

    const tempResult = tempCompile({
      createdAt: new Date(),
      email: email,
      username: username,
      link: link,
    });

    await transporter.sendMail({
      from: 'amanhidayat39@gmail.com',
      to: email,
      subject: 'Email Confirmation',
      html: tempResult,
    });
    res.status(200).send({ message: 'Email has been send' });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};
export const updateUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    console.log('ini data body', req.body);

    await User.update(
      {
        password: hashPassword,
      },
      {
        where: {
          email: email,
        },
      },
    );
    res.status(200).send('Profile22');
  } catch (error) {
    res.status(400).send({ err: err.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, username, email, picture } = req.body;
    await User.update(
      {
        name,
        username,
        email,
        picture: req.file?.path,
        isVerified: false,
      },

      {
        where: {
          id: req.user.id,
        },
      },
    );
    const data = fs.readFileSync('./web/verifiedakun.html', 'utf-8');
    const tempCompile = handlebars.compile(data);
    const tempResult = tempCompile({
      name: name,
      username: username,
      link: `http://localhost:5173/verify/${req.user.id}`,
    });
    await transporter.sendMail({
      from: 'amanhidayat39@gmail.com',
      to: email,
      subject: 'Email Confirmation',
      html: tempResult,
    });
    res.status(200).send('Profile');
  } catch (err) {
    console.log(err);
    res.status(400).send({ err: err.message });
  }
};
