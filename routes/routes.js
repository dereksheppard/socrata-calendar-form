const router = require('express').Router();
const soda = require('soda-js');
const session = require('express-session');

var auth = function(req, res, next) {
  if (req.session.user)
    return next();
  else {
    res.statusCode = 401;
    res.render('login')
    return res;
  }
};

var routes = function (config) { 
  var producer = new soda.Producer('data.kingcounty.gov', config.socrata);
  router.route('/')
    //.get(Authentication.BasicAuthentication, function (req, res) {
    .get(auth, function (req, res) {
      res.render('index');
    })
    .post(function (req, res) {
      var body = req.body;
      body.displayOnHomePage = (body.displayOnHomePage) ? true : false;
      var data = {
        start_time: body.startTimeDate,
        end_time: body.endTimeDate,
        event_name: body.eventName,
        event_description_details: body.eventDescription,
        location_name: body.locationName,
        location: {
          human_address: {
            address:body.street,
            city:body.city,
            state: body.state,
            zip: body.zip
          }
        },
        url: body.linkUrl,
        contact_name: body.contactName,
        contact_email: body.contactEmail,
        contact_phone: body.contactPhoneType,
        host_contact_department: body.contactDept,
        feed_keyword_s: body.feedKeywords,
        home_page_y_n: body.displayOnHomePage,
        arts_culture: body.categoryArtsCulture,
        best_starts_for_kids: body.categoryBestStarts,
        business: '',
        closure: '',
        council: '',
        courts: '',
        elections: '',
        emergency: '',
        employees: '',
        environment: '',
        events: '',
        executive: '',
        health: '',
        jails: '',
        jobs: '',
        licenses: '',
        metro: '',
        news: '',
        operations: '',
        parks: '',
        permits: '',
        pets: '',
        property: '',
        recreation: '',
        recycling_trash: '',
        roads: '',
        rural: '',
        safety: '',
        sheriff: '',
        socialservices: '',
        transportation: '',
        volunteer: '',
        tac_meeting: ''
      };
      // Push to Socrata
      producer.operation()
        .withDataset(config.socrata.dataset)
        .add(data)
          .on('success', function(row) { console.log(row);  })
          .on('error', function(error) { console.error(error); })
      res.redirect('/');
    });
    router.get('/error', function (req, res) {
      res.render('error');
    })
    router.post('/login', (req, res) => {
      var body = req.body;
      var user = body.user;
      var pass = body.pass;
      if (user === config.login.user || pass === config.login.pass) {
        req.session.user = "king_county";
        req.session.admin = true;
        res.redirect('/');
      } else {
        res.redirect('error');
      }
    });

  return router;
};

module.exports = routes;
