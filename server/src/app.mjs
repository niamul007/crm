import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 5000;  

app.get('/', (req, res) => {
  res.send('Hello World! here is the backend server of CRM')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
})