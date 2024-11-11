const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema definition
const loginSchema = new mongoose.Schema({
  f_sno: Number,
  f_userName: { type: String, required: true, unique: true },
  f_Pwd: { type: String, required: true },
});

// Model
const Login = mongoose.model('Login', loginSchema);

// Connect to MongoDB and Insert Data
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/admin-panel', {
    });
    console.log('Database connected successfully');

    // Data with plaintext passwords
    const logins = [
      { f_sno: 2, f_userName: 'maha', f_Pwd: 'maha1122' },
      { f_sno: 3, f_userName: 'nasru', f_Pwd: 'nasru1122' },
    ];

    // Hash passwords
    const hashedLogins = await Promise.all(
      logins.map(async (login) => {
        const hashedPassword = await bcrypt.hash(login.f_Pwd, 10);
        return { ...login, f_Pwd: hashedPassword };
      })
    );

    // Insert hashed data into the database
    await Login.insertMany(hashedLogins);
    console.log('Data inserted successfully with hashed passwords');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
connectDB();
