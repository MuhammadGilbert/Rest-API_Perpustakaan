//inisialisasi aplikasi menggunakan express js
const express = require("express")
const cors = require("cors")
const mysql = require("mysql")

//implementasikan
const app = express()
app.use(cors())
app.use(express.json()) //ini untuk menggunakan json
app.use(express.urlencoded({extended: true})) //ini untuk mendapatkan value pada url nya

//membuat koneksi
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'perpus'
})

//untuk mengecek apakah sudah terkoneksi dengan mysql(database) atau tidak
db.connect(error => {
    if(error){
        console.log(error.message)
    }else{
        console.log("Berhasil Terkoneksi!")
    }
})

//data dumy (ini buat array ) (gapake database)
let nextId = 4;
const books = [
    {id: 1, title: "The First", year: 2019},
    {id: 2, title: "The Second", year: 2020},
    {id: 3, title: "The Third", year: 2021},
]
//endpoint endpoint 
//ini untuk selamat datang
app.get("/" , (req,res) => {
    res.send({
        message: "Berhasil melakukan pemanggilan get",
        data: {
            description:
            "Endpoint ini untuk menampilkan data",
        }
    })
})

//ini untuk menampilkan data data bukunya
//ini app.get untuk post nya
app.get("/books", (req,res) => {
    //create sql query (krn berhubungan dgn dtabase)
    let sql = 'SELECT * FROM perpustakaan'

    //run query
    db.query(sql, (error, result) => { //error untuk menangkap menampilkan error apa, Result ini menampilkan hasilnya
        let response = null
        if(error){
            response = {
                message: error.message
            }
        }else{
            response = {
                result 
            }
        }
        res.json(response)
    }) 

})

// //ini app.get untuk put nya
// app.get("/book/:id", (req,res) => {
//     const bookIndex = books.findIndex((item) => item.id == req.params.id)
//     res.send({
//         message: "Berhasil menampilkan perubahan data buku",
//         data: { book: books[bookIndex]}
//     })
// })

//kalau untuk mengisikan data pakai request
app.post("/books", (req,res) => {
    //deklarasi variabel untuk inputan user
    var tambah_book = {
        title: req.body.title,
        year: req.body.year
    }
    //insert data buku ke database nya 
    // SET = VALUES
    db.query('INSERT INTO perpustakaan SET ?', tambah_book, (error, result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        }else{
            res.send("Berhasil menambahkan buku berjudul " + tambah_book.title + " dengan tahun terbit " +tambah_book.year)
            console.log("Berhasil menambahkan buku", result)
        }
    })

})

//ini buat put buku
app.put("/books/:id" , (req,res) => {
    let id = req.params.id
    let edit_buku = {
        title : req.body.title,
        year : req.body.year,

    }
   
    db.query(`UPDATE perpustakaan SET ? WHERE id = '${id}'`, edit_buku, (error, result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        }else{
            res.send("Berhasil edit buku berjudul " + edit_buku.title + " dengan tahun terbit " +edit_buku.year)
            console.log("Berhasil update buku", result)
        }
    })
    

})

//ini buat delete buku
app.delete("/books/:id", (req,res) => {
    let id = req.params.id
    db.query(`DELETE  FROM perpustakaan WHERE id = '${id}'`,(error, result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        }else{
            res.send("Berhasil hapus buku")
            console.log("Berhasil hapus buku", result)
        }
    })
})

const port = 8000;
app.listen(port, () => console.log (`app running ${port}`))

//cors ini digunakan untuk agar bisa dikses oleh orang lain