const express = require('express');
const app = require('../app');
const path = require('path')
const PORT = process.env.PORT || 3000;

// listener
app.listen(PORT, () => {
    console.log(`Listener is ready to use. 
    \nwith port: ${PORT}`);
});

module.exports = app;