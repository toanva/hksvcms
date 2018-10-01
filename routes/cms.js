var express = require('express');
var router = express.Router();
var config = require('config');
const {
	MessengerClient
} = require('messaging-api-messenger');
const {
	MessengerBatch
} = require('messaging-api-messenger');
var Cryptojs = require("crypto-js");//Toanva add

const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
	(process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
	config.get('pageAccessToken');
const client = MessengerClient.connect({
    accessToken: PAGE_ACCESS_TOKEN,
    version: '3.1',
});

var objDb = require('../object/database.js');
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.sendFile('login.html', {
        root: "views/cms"
    });
});

router.get('/member', function (req, res, next) {
    res.sendFile('member.html', {
        root: "views/cms"
    });
});

router.get('/sendmessage', function (req, res, next) {
    res.sendFile('sendmessage.html', {
        root: "views/cms"
    });
});

router.get('/chart', function (req, res, next) {
    res.sendFile('chart.html', {
        root: "views/cms"
    });
});

//Toanva add getkeyCMS
router.post('/getkeyCMS', function (req, res) {
    let body = req.body;
    if (req.session.cms_key == null) {
        req.session.cms_key = req.sessionID;
        res.send(req.sessionID);
    }
    else {
        res.send(req.session.cms_key);
    }
});
//Toanva add getMemberCMS
router.get('/getMemberCMS', (req, res) => {
    if (req.session == null || req.session.admin == null) {
        return res.sendStatus(401);
    }
    var name = req.query.name;
    var psid = req.query.psid;
    var provincial = req.query.provincial;
    var districts = req.query.districts;
    var wards = req.query.wards;
    var position = req.query.position;
    var level = req.query.level;
    var layer = req.query.layer;
    var blockstatus = req.query.blockstatus;
    var phone = req.query.phone;
    if (psid == null || psid == 'all')
        psid = "";
    if (name == null || name == 'all')
        name = "";
    if (provincial == null || provincial == 'all' || provincial == 'NA')
        provincial = "";
    if (districts == null || districts == 'all' || districts == 'NA')
        districts = "";
    if (wards == null || wards == 'all' || wards == 'NA')
        wards = "";
    if (position == null || position == 'all' || position == 'NA')
        position = "";
    if (level == null || level == 'all' || level == 'NA')
        level = "";
    if (layer == null || layer == 'all' || layer == 'NA')
        layer = "";
    if (blockstatus == null || blockstatus == 'all')
        blockstatus = "";
    if (phone == null || phone == 'all')
        phone = "";
    var query = {};
    if (name != "") {
        name = ".*" + name + ".*";
        Object.assign(query, {
            Name: {
                $regex: name
            }
        });
    }
    if (psid != "") {
        Object.assign(query, {
            _id: psid
        });
    }
    if (blockstatus != "") {
        Object.assign(query, {
            BlockStatus: blockstatus
        });
    }
    if (phone != "") {
        phone = ".*" + phone + ".*";
        Object.assign(query, {
            Phone: {
                $regex: phone
            }
        });
    }

    if (provincial != "") {
        Object.assign(query, {
            Provincial: provincial
        });
    }
    if (districts != "") {
        Object.assign(query, {
            District: districts
        });
    }
    if (wards != "") {
        Object.assign(query, {
            Ward: wards
        });
    }
    if (position != "") {
        Object.assign(query, {
            Position: position
        });
    }
    Object.assign(query, {
            Type: "Candidates"
        });
    console.log("GetMemberCMS query", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            client.close();
            res.send(results);
        });
    });
});
//Toanva getMemberCMS end
//Toanva add getMemberSendMessage
router.get('/getMemberSendMessage', (req, res) => {
    if (req.session == null || req.session.admin == null) {
        return res.sendStatus(401);
    }
    var name = req.query.name;
    var psid = req.query.psid;
    var type = req.query.type;
    var phone = req.query.phone;
    var schools = req.query.schools;
    var placeofcontest = req.query.placeofcontest;
    if (psid == null || psid == 'all')
        psid = "";
    if (name == null || name == 'all')
        name = "";
    if (phone == null || phone == 'all')
        phone = "";
    if (type == null || type == 'all')
        type = "";
    if (schools == null || schools == 'all')
        schools = "";
    if (placeofcontest == null || placeofcontest == 'all')
        placeofcontest = "";
    
    var query = {};
    if (name != "") {
        name = ".*" + name + ".*";
        Object.assign(query, {
            Name: {
                $regex: name
            }
        });
    }
    if (name != "") {
        name = ".*" + name + ".*";
        Object.assign(query, {
            Name: {
                $regex: name
            }
        });
    }
    if (psid != "") {
        Object.assign(query, {
            _id: psid
        });
    }
    
    if (phone != "") {
        phone = ".*" + phone + ".*";
        Object.assign(query, {
            Phone: {
                $regex: phone
            }
        });
    }

    if (placeofcontest != "") {
        placeofcontest = ".*" + placeofcontest + ".*";
        Object.assign(query, {
            PlaceOfContest: {
                $regex: placeofcontest
            }
        });
    }

    if (schools != "") {
        schools = ".*" + schools + ".*";
        Object.assign(query, {
            Schools: {
                $regex: schools
            }
        });
    }

    if (type != "") {
        Object.assign(query, {
            Type: type
        });
    }
    
    console.log("GetMemberCMS query", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            client.close();
            res.send(results);
        });
    });
});
//Toanva getMemberSendMessage end
router.get('/getListMemberKsv', (req, res) => {

    var psid = req.query.psid;
    console.log("getListMemberKsv psid: ", psid);

    var query = {
        _id: psid
    };
    console.log("getListMemberKsv query: ", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            if (results.length > 0) {
                results = results[0];

                var queryDetail = { _id: { $ne: psid } };/////Loại bỏ chính mình ra khỏi danh sách
                ////layerDelegatelayer- Delegate , được ủy quyền để tăng 1 cấp layer
                if (results.Delegate == null) {
                    results.Delegate = 0;
                }
                var layerDelegate = Number(results.Layer) - Number(results.Delegate);
                if (layerDelegate < 0) {
                    layerDelegate = 0;// chỉ cho Ủy quyền đến cấp admin
                }
                console.log("getListMemberKsv layerDelegate: ", layerDelegate);
                if (results.BlockStatus == "ACTIVE" && results.Layer == results.Level) {
                    console.log("getListMemberDelegate Level : ", results.Level);
                    ///// layer+1 + va + ủy quyền để thấy dưới 1 lớp
                    var layer = layerDelegate + 1;
                    //var layer = Number(results.Layer) + 1;

                    if (results.Level == 1 || results.Level == 0) {
                        results.Provincial = "";
                        results.District = "";
                        results.Ward = "";

                    }
                    ///// Lấy ra thành viên cùng lớp

                    if (results.Level == 1) {
                        ////// Lấy cả layer = 1 và layer =2
                        Object.assign(queryDetail, { $or: [{ Layer: 2 }, { Layer: 1 }] });
                    } else {
                        /// Lấy leyer dưới 1 cấp
                        if (results.Layer != undefined && results.Layer != "" && layer != 1 && layer != 0) {
                            Object.assign(queryDetail, {
                                Layer: Number(layer)
                            });
                        }
                    }
                    if (layer != 1 && layer != 0) {
                        if (results.Provincial != "") {
                            Object.assign(queryDetail, {
                                Provincial: results.Provincial
                            });
                        }
                        if (results.District != "") {
                            Object.assign(queryDetail, {
                                District: results.District
                            });
                        }
                        if (results.Ward != "") {
                            Object.assign(queryDetail, {
                                Ward: results.Ward
                            });
                        }
                    }
                    //					Object.assign(queryDetail, {
                    //						BlockStatus: 'ACTIVE'
                    //					});
                    console.log("getListMemberDelegate query detail", queryDetail);
                    objDb.findMembers(queryDetail, client, function (resultsList) {
                        client.close();
                        res.send(resultsList);
                    });
                } else {
                    client.close();
                    res.send(null);
                }


            } else {
                client.close();
                res.send(results);
            }
        });
    });
});

router.get('/logoutCMS', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});
//Toanva add loginCMS
router.post('/loginCMS', function (req, res) {
    let body = req.body;
    var bytes = Cryptojs.AES.decrypt(body.data, req.sessionID);
    var decryptedData = JSON.parse(bytes.toString(Cryptojs.enc.Utf8));
    if (!decryptedData.UserName || !decryptedData.Password) {
        console.log("loginCMS failed");
        res.send('Mật khẩu hoạc tài khoản không đúng');
    }
    else {
        console.log("loginCMS:", decryptedData.UserName);
        var query = {
            UserName: decryptedData.UserName,
            Password: Cryptojs.MD5(decryptedData.Password).toString()
        }
        objDb.getConnection(function (client) {
            objDb.findUsers(query, client, function (results) {
                client.close();
                if (results !== null && results.length > 0) {
                    console.log("loginCMS success");
                    req.session.user = body.UserName;
                    req.session.admin = true;
                    console.log("session.admin", req.session.admin);
                    req.session.faceUser = true;
                    res.json({ success: "true", message: 'Đăng nhập thành công' });
                }
                else {
                    console.log("loginCMS failed");
                    res.json({ success: "false", message: 'Mật khẩu hoạc tài khoản không đúng' });
                }
            });
        });
    }
});

router.get('/getMemberByGroup', (req, res) => {
    if (req.session == null || req.session.admin == null) {
        return res.sendStatus(401);
    }
    var code = req.query.code;
    var options = {};
    var pipeline = [];
    if (code == "day") {
        pipeline = [
            { $match: { Type: "Candidates" } },
            {
            "$group": {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$InsertDate" } }
                },
                count: { $sum: 1 }
            }
        }, {
            "$sort": {
                "_id.date": 1
            }
        }, {
            "$project": {
                "_id": 0,
                "Date": "$_id.date",
                "Total": "$count"
            }
        }];
    }
    console.log("getMemberByGroup", code);
    objDb.getConnection(function (client) {
        objDb.findMembersByGroup(pipeline, options, client, function (results) {
            client.close();
            res.send(results);
        });
    });
});

router.get('/getUserByGroup', (req, res) => {
    if (req.session == null || req.session.admin == null) {
        return res.sendStatus(401);
    }
    var code = req.query.code;
    var options = {};
    var pipeline = [];
    if (code == "day") {
        pipeline = [
            {
            "$group": {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$InsertDate" } }
                },
                count: { $sum: 1 }
            }
        }, {
            "$sort": {
                "_id.date": 1
            }
        }, {
            "$project": {
                "_id": 0,
                "Date": "$_id.date",
                "Total": "$count"
            }
        }];
    }
    console.log("getUserByGroup", code);
    objDb.getConnection(function (client) {
        objDb.findMembersByGroup(pipeline, options, client, function (results) {
            client.close();
            res.send(results);
        });
    });
});

router.post('/sendMessageToMember', function (req, res) {
    let body = req.body;

    var msg = body.message;
    console.log("PAGE_ACCESS_TOKEN: ", PAGE_ACCESS_TOKEN);
    console.log("Send message text: ", msg); 
    var qk = {
        quick_replies: [{
            content_type: 'text',
            title: 'Quay về menu',
            payload: 'menu',
        },]
    };
    var arr = [];
    var name = body.name;
    console.log("query name: ", name);
    var psid = body.psid;
    var type = body.type;
    var phone = body.phone;
    var schools = body.schools;
    var placeofcontest = body.placeofcontest;
    if (psid == null || psid == 'all')
        psid = "";
    if (name == null || name == 'all')
        name = "";
    if (phone == null || phone == 'all')
        phone = "";
    if (type == null || type == 'all')
        type = "";
    if (schools == null || schools == 'all')
        schools = "";
    if (placeofcontest == null || placeofcontest == 'all')
        placeofcontest = "";

    var query = {};
    if (name != "") {
        name = ".*" + name + ".*";
        Object.assign(query, {
            Name: {
                $regex: name
            }
        });
    }
    if (name != "") {
        name = ".*" + name + ".*";
        Object.assign(query, {
            Name: {
                $regex: name
            }
        });
    }
    if (psid != "") {
        Object.assign(query, {
            _id: psid
        });
    }

    if (phone != "") {
        phone = ".*" + phone + ".*";
        Object.assign(query, {
            Phone: {
                $regex: phone
            }
        });
    }

    if (placeofcontest != "") {
        placeofcontest = ".*" + placeofcontest + ".*";
        Object.assign(query, {
            PlaceOfContest: {
                $regex: placeofcontest
            }
        });
    }

    if (schools != "") {
        schools = ".*" + schools + ".*";
        Object.assign(query, {
            Schools: {
                $regex: schools
            }
        });
    }

    if (type != "") {
        Object.assign(query, {
            Type: type
        });
    }

    
    objDb.getConnection(function (clientDB) {
        objDb.findMembers(query, clientDB, function (results) {
            clientDB.close();
            console.log("Total member: ", results.length);
            //1807839409264674 psid toanva
            arr.push(MessengerBatch.sendText("1807839409264674", msg, qk));
            client.sendBatch(arr);
            console.log("Send member: ", arr);
            console.log("Send member: ", arr.length);
            res.json({ success: "true", message: 'Gửi tin nhắn thành công' });
            //var j = 0;
            //for (var i = 0; i < results.length; i++) {

            //    console.log("add member: ", results[i]._id);
            //    var id = results[i]._id.toString();

            //    arr.push(MessengerBatch.sendText(id, msg, qk));
            //    if (j == 48) {
            //        j = 0;
            //        client.sendBatch(arr);
            //        console.log("Send member: ", arr.length);
            //        arr = [];
            //    } else if ((results.length - i) < 48) {
            //        j = 0;
            //        client.sendBatch(arr);
            //        arr = [];
            //        console.log("Total Send member: ", i);
            //    }
            //    j++;
            //}
        });
    });
});
router.get('/getMemberSendMessage', (req, res) => {
    if (req.session == null || req.session.admin == null) {
        return res.sendStatus(401);
    }
    var name = req.query.name;
    var psid = req.query.psid;
    var type = req.query.type;
    var phone = req.query.phone;
    var schools = req.query.schools;
    var placeofcontest = req.query.placeofcontest;
    if (psid == null || psid == 'all')
        psid = "";
    if (name == null || name == 'all')
        name = "";
    if (phone == null || phone == 'all')
        phone = "";
    if (type == null || type == 'all')
        type = "";
    if (schools == null || schools == 'all')
        schools = "";
    if (placeofcontest == null || placeofcontest == 'all')
        placeofcontest = "";

    var query = {};
    if (name != "") {
        name = ".*" + name + ".*";
        Object.assign(query, {
            Name: {
                $regex: name
            }
        });
    }
    if (name != "") {
        name = ".*" + name + ".*";
        Object.assign(query, {
            Name: {
                $regex: name
            }
        });
    }
    if (psid != "") {
        Object.assign(query, {
            _id: psid
        });
    }

    if (phone != "") {
        phone = ".*" + phone + ".*";
        Object.assign(query, {
            Phone: {
                $regex: phone
            }
        });
    }

    if (placeofcontest != "") {
        placeofcontest = ".*" + placeofcontest + ".*";
        Object.assign(query, {
            PlaceOfContest: {
                $regex: placeofcontest
            }
        });
    }

    if (schools != "") {
        schools = ".*" + schools + ".*";
        Object.assign(query, {
            Schools: {
                $regex: schools
            }
        });
    }

    if (type != "") {
        Object.assign(query, {
            Type: type
        });
    }

    console.log("GetMemberCMS query", query);
    objDb.getConnection(function (client) {
        objDb.findMembers(query, client, function (results) {
            client.close();
            res.send(results);
        });
    });
});

module.exports = router;
