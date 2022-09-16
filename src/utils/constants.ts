export default {
    env: process.env.NODE_ENV === "production" ? 'https://engagex-app.herokuapp.com/' : "http://localhost:3000/",
};