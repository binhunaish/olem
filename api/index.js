const app = require('../app');
const PORT = process.env.PORT || 3000;

// listener
app.listen(PORT, () => {
    console.log(`Listener is ready to use. 
    \nwith port: ${PORT}`);
});

module.exports = app;