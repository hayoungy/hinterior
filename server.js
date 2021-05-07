// 모듈을 추출합니다.
var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');
var fs = require('fs');
var mysql = require('mysql');

// 데이터베이스와 연결합니다.
var client = mysql.createConnection({
    user: 'root',
    password: 'hayo',
    database: 'Company'
});

// 웹 서버를 생성합니다.
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function (request, response) {
    // 변수를 선언합니다.
    var customername = request.body.customername;

    var phonenumber1 = request.body.phonenumber1;
    var phonenumber2 = request.body.phonenumber2;
    var phonenumber3 = request.body.phonenumber3;
    var phonenumber = phonenumber1 + '-' + phonenumber2 + '-' + phonenumber3;

    var email = request.body.email;
    var date = request.body.date;
    var time = request.body.time;

    var type = '';
    var typet = request.body.type;
    if (typet == 'residence') { type = '주택'; }
    if (typet == 'office') { type = '사무실'; }
    if (typet == 'retail') { type = '가게'; }
    if (typet == 'etc') { type = request.body.etcexplanation; }

    var insideimage = '';

    var area = '';
    var varn = request.body.area;
    var varm = request.body.measure;
    var area = varn + varm;

    var budgetitv = request.body.budget + '원';
    var budget = budgetitv;
    var designimage = '';
    var commnet = request.body.commnet;

    // 데이터베이스 요청을 수행합니다.
    client.query('INSERT INTO cstlst (customername, phonenumber, email, date, time, type, insideimage, area, budget, designimage, commnet) VALUES(?,?,?,?,?,?,?,?,?,?,?)', [
        customername, phonenumber, email, date, time, type, insideimage, area, budget, designimage, commnet
    ], function (error, data) {
        response.redirect('/?valid=' + data);
    });
});

app.get('/admin', function (request, response) {
    // 파일을 읽습니다.
    fs.readFile('admin.html', 'utf8', function (error, data) {
      // 데이터베이스 쿼리를 실행합니다.
      client.query('SELECT * FROM cstlst', function (error, results) {
        // 응답합니다.
        response.send(ejs.render(data, {
          data: results
        }));
      });
    });
});

/*app.get('/admin/:phonenumber', function (request, response) {
    // 파일을 읽습니다.
    fs.readFile('admin.html', 'utf8', function (error, data) {
        // 데이터베이스 쿼리를 실행합니다.
        client.query('SELECT * FROM cstlst WHRER phonenumber = ?', [
            request.params.phonenumber
        ], function (error, results) {
            // 응답합니다.
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});*/

app.get('/admin/edit/:id', function (request, response) {
    fs.readFile('edit.html', 'utf8', function (error, data) {
      client.query('SELECT * FROM cstlst WHERE id = ?', [
          request.params.id
      ], function (error, result) {
        response.send(ejs.render(data, {
          data: result[0]
        }));
      });
    });
});

app.post('/admin/edit/:id', function (request, response) {
    var body = request.body;
      client.query('UPDATE cstlst SET customername=?, phonenumber=?, email=?, date=?, time=?, type=?, insideimage=?, area=?, budget=?, designimage=?, commnet=? WHERE id=?', 
         [body.customername, body.phonenumber, body.email, body.date, body.time, body.type, body.insideimage, body.area, body.budget, body.designimage, body.commnet, request.params.id], function () {
         response.redirect('/admin');
      });
    });

app.get('/admin/delete/:id', function (request, response) {
    client.query('DELETE FROM cstlst WHERE id=?', [request.params.id], function () {
      response.redirect('/admin');
   });
});

/*

*/

app.listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});