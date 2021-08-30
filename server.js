const express=require('express')
const useRouter=require('./routers/router')
const morgan = require('morgan');

const PORT=process.env.PORT || 3000;
const app=express();

app.use(morgan('tiny'));

app.use(express.json())
app.use('/api', useRouter);


app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});



