var express = require('express');
var router = express.Router();
var Cryptojs = require("crypto-js");//Toanva add

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
        pipeline = [{
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
module.exports = router;
