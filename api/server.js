// routes/user.js
const { connectMongodb } = require('../api/connect');
const express = require('express');
const cors = require('cors');
const user = express();

user.use(cors({
  origin: 'http://localhost:5500',
  methods: ['GET', 'POST'],
}));

user.use(express.json());

// Función auxiliar para normalizar los datos del usuario
const normalizeUserData = (profile, provider) => {
  return {
    providerId: profile.id,
    provider: provider,
    email: profile.emails?.[0]?.value || null,
    name: provider === 'google' 
      ? `${profile.name?.givenName} ${profile.name?.familyName}`
      : profile.displayName || null,
    picture: profile.photos?.[0]?.value || null,
    createdAt: new Date(),
    lastLogin: new Date()
  };
};


// Guardar usuario de Google
user.post('/auth/google/save', async (req, res) => {
  try {
    const db = await connectMongodb();
    const collection = db.collection('users');
    const profile = req.body;

    // Normalizar datos del usuario
    const userData = normalizeUserData(profile, 'google');

    // Verificar si el usuario ya existe
    const existingUser = await collection.findOne({ 
      email: userData.email 
    });

    if (existingUser) {
      // Actualizar último login
      await collection.updateOne(
        { email: userData.email },
        { $set: { lastLogin: new Date() } }
      );
      return res.status(200).json(existingUser);
    }

    // Crear nuevo usuario
    const result = await collection.insertOne(userData);
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Guardar usuario de Discord
user.post('/auth/discord/save', async (req, res) => {
  try {
    const db = await connectMongodb();
    const collection = db.collection('users');
    const profile = req.body;

    const userData = normalizeUserData(profile, 'discord');

    const existingUser = await collection.findOne({ 
      email: userData.email 
    });

    if (existingUser) {
      await collection.updateOne(
        { email: userData.email },
        { $set: { lastLogin: new Date() } }
      );
      return res.status(200).json(existingUser);
    }

    const result = await collection.insertOne(userData);
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Guardar usuario de Facebook
user.post('/auth/facebook/save', async (req, res) => {
  try {
    const db = await connectMongodb();
    const collection = db.collection('users');
    const profile = req.body;

    const userData = normalizeUserData(profile, 'facebook');

    const existingUser = await collection.findOne({ 
      email: userData.email 
    });

    if (existingUser) {
      await collection.updateOne(
        { email: userData.email },
        { $set: { lastLogin: new Date() } }
      );
      return res.status(200).json(existingUser);
    }

    const result = await collection.insertOne(userData);
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = user;