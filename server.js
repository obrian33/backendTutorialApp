import express from 'express';
import cors  from 'cors';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import Issue  from './models/Issue';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyparser.json());

mongoose.connect('mongodb://localhost/issues');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

app.use('/', router);

router.route('/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if (err) {
            console.log(err);
        } else {
            res.json(issues);
        }
    });
});

router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (err) {
            console.log(err);
        } else {
            res.json(issue);
        }
    });
});

router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({'issue': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

app.listen(4000, () => {
    console.log('Express server on port 4000');
});
