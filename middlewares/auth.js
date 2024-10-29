import { User } from '../models/user.js';

export const saveUserData = async (profile, provider) => {
  try {
    let userData = {
      provider,
      providerId: profile.id
    };

    // Extraer datos según el proveedor
    switch(provider) {
      case 'discord':
        userData.email = profile.email;
        userData.name = profile.username;
        break;
      
      case 'facebook':
        userData.email = profile.emails?.[0]?.value;
        userData.name = profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`;
        break;
      
      case 'google':
        userData.email = profile.emails[0].value;
        userData.name = profile.displayName;
        break;
    }

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email: userData.email });
    
    if (user) {
      // Actualizar información si es necesario
      user = await User.findOneAndUpdate(
        { email: userData.email },
        { 
          $set: {
            name: userData.name,
            providerId: userData.providerId,
            provider: userData.provider
          }
        },
        { new: true }
      );
    } else {
      // Crear nuevo usuario
      user = await User.create(userData);
    }

    return user;
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    throw error;
  }
};