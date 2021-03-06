import React, {Component} from 'react';
import {connectProfile} from '../auth';
import './EditProfile.css';
// import Avatar from 'material-ui/Avatar';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import ImageFilterVintage from 'material-ui/svg-icons/image/filter-vintage';
// import PlacesSpa from 'material-ui/svg-icons/places/spa';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import axios from 'axios';
import Badge from 'material-ui/Badge';
// FROM DINO
import Paper from 'material-ui/Paper';
import { Link } from 'react-router';
import InlineEdit from 'react-edit-inline';
import FlatButton from 'material-ui/FlatButton';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
//
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const gitHubAtts = [
  // 'email',
  // 'name',
  // 'nickname',
  // 'html_url',
  // 'location',
  'public_repos',
  'followers',
  'following',
  'updated_at'
  /**
  EXTRA INFO --------- ---------  --------- --------->
  'public_gists',
  'picture',
  'gravatar_id',
  'type',
  'site_admin',
  'user_metadata',
  'emails',
  'clientID',
  'user_id',
  'identities',
  'created_at',
  'email_verified',
  'sub',
  API LINKS ----- ----- -----> CAN REQUEST INFO FROM THE FOLLOWING API ENDPOINTS:
  'followers_url',
  'following_url',
  'gists_url',
  'starred_url',
  'subscriptions_url',
  'organizations_url',
  'repos_url',
  'events_url',
  'received_events_url'
  <----- ----- ----- API LINKS
  <--------- --------- --------- --------- EXTRA INFO
  **/
];

const googleAtts = [ // user_metadata.location -- NYC
  'gender'
  // 'email',
  // 'name',
  // 'picture',
];
//
const linkedInAtts = [
  'headline',
  'industry',
  'summary'
  // location.name
];

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "a",
      open: false
    };
  }

  static propTypes = {
    ...connectProfile.PropTypes
  };

  state = {
    error: null,
    saved: false,
    saving: false
  }

  getUser() {
    axios.get('/api/users/' + this.props.profile.email)
    .then((user) => {
      this.setState({ userProfile: user.data })
    })
    .then(() => {
      console.log('state on render:', this.state);
    })
    .catch((error) => {
      console.log(error)
    })
  }

  componentWillMount() {
    this.getUser();
  }

  handleSubmit() {
    axios({
      method: 'put',
      data: {
        'name': this.state.name,
        'avatar': this.state.userProfile.user.avatar,
        'job': this.state.job,
        'about': this.state.about,
        'location': this.state.location
      },
      url: `http://localhost:8000/api/users/${this.state.userProfile.user.email}`,
    }).then(() => {
      this.setState({
        open: true
      });
    });
  }

  handleProfileEdit(edited, event) {
    this.setState({
      [edited]: event[edited]
    });
    console.log('new state:', this.state);
  }

  renderProfileCard() {
    let profile = this.state.userProfile.user;
    console.log('state in card render:', this.state);
    const cardStyle = {
      width: 350,
      margin: 20,
      overflow: 'auto',
      backgroundColor: '#FFDB77'
    };
    const imageInput = {
      cursor: 'pointer',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100%',
      opacity: 0,
    };
    const buttonStyle = {
      fontFamily: 'Nunito',
      backgroundColor: '#867DCC',
      color: '#FFDB77',
    };
    return (
      <Card style={cardStyle} zDepth={1}>
        <CardMedia overlay={<CardTitle subtitle={<InlineEdit text={profile.name} paramName="name" activeClassName="Purple" change={this.handleProfileEdit.bind(this, 'name')} />} subtitleStyle={{fontFamily: 'Nunito', color: '#FFDB77', fontSize: 20}}/> }>
          <img src={profile.avatar} size={200} />
        </CardMedia>
        <CardTitle style={{fontFamily: "Nunito"}} title={<InlineEdit text={profile.job} paramName="job" change={this.handleProfileEdit.bind(this, 'job')} />} subtitle={<InlineEdit text={profile.location} paramName="location" change={this.handleProfileEdit.bind(this, 'location')} />} />
        <CardText style={{fontFamily: 'Nunito'}}>
          <h2 style={{color: '#867DCC'}}><strong>About Me</strong></h2>
          <Divider style={{backgroundColor: '#867DCC'}}/>
          <br />
          <InlineEdit style={{width: '100%', height: '100%'}} text={profile.about} paramName="about" change={this.handleProfileEdit.bind(this, 'about')} />
        </CardText>
        <BottomNavigation style={buttonStyle}>
          <BottomNavigationItem
            label="Update Profile"
            labelPosition="before"
            primary={true}
            icon={<Refresh />}
            style={{color: '#FFDB77'}}
            onClick={this.handleSubmit.bind(this)}
            />
        </BottomNavigation>
        <Snackbar
          open={this.state.open}
          message="Profile was updated!"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </Card>
    );
  }

  renderProfilePaper() {
    let profile = this.state.userProfile.user;
    const authProfile = this.props.profile;
    const user_metadata = authProfile.user_metadata || {};
    const innerPaperStyle = {
      fontFamily: 'Nunito',
      margin: 25,
      overflow: 'auto'
    };
    const strong = {
      fontSize: 18,
      color: '#867DCC'
    };
    const center = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    return (
      <div style={innerPaperStyle}>
        <div>
          <p><span style={strong}>Email:</span> <InlineEdit text={profile.email} /></p>
        </div>
        <div style={center}>
          <FlatButton style={{backgroundColor: '#ED222A'}} icon={<ActionDeleteForever />} />
        </div>
      </div>
    );
  }

  renderPostList() {
    const profile = this.state.userProfile
    const tableStyle = {
      fontFamily: 'Nunito',
      backgroundColor: '#FFDB77'
    };
    if (profile) {
      return (
        <div>
          <Table selectable multiSelectable style={tableStyle}>
            <TableHeader displaySelectAll={false}>
              <TableRow style={{fontSize: 20}}>
                <TableHeaderColumn>Affirmation Title</TableHeaderColumn>
                <TableHeaderColumn>Phase</TableHeaderColumn>
                <TableHeaderColumn tooltip="Favorites"><ActionFavorite /></TableHeaderColumn>
                <TableHeaderColumn>Helpful</TableHeaderColumn>
                <TableHeaderColumn>Unhelpful</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover>
              {profile.posts.map((post) => {
                return (
                  <TableRow displayBorder>
                    <TableRowColumn>{post.title}</TableRowColumn>
                    <TableRowColumn>{post.phase}</TableRowColumn>
                    <TableRowColumn>{post.favorites}</TableRowColumn>
                    <TableRowColumn>{post.helpful}</TableRowColumn>
                    <TableRowColumn>{post.unhelpful}</TableRowColumn>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      );
    }
  }

  handleTabChange = (value) => {
    this.setState({
      value: value,
    });
  }

  // onSubmit = (event) => {
  //   event.preventDefault();
  //
  //   this.setState({saving: true}, async () => {
  //     const error = await this.props.onUpdateProfile({
  //       user_metadata: {
  //         location: this.locationInput.value
  //       }
  //     });
  //     this.setState({error, saved: !error, saving: false});
  //   });
  // }
  //
  // onClearSaved = (event) => {
  //   this.setState({saved: false});
  // }
  //
  // <div className="EditProfile-heading">Edit Profile</div>
  // <form className="EditProfile-form" onSubmit={this.onSubmit} onChange={this.onClearSaved}>
  //   <fieldset className="EditProfile-fieldset" disabled={saving}>
  //     <label className="EditProfile-locationLabel" htmlFor="location">Location</label>
  //     <input
  //       ref={(ref) => this.locationInput = ref}
  //       className="EditProfile-locationInput"
  //       id="location"
  //       type="text"
  //       placeholder="City or State"
  //       />
  //     <div className="EditProfile-formControls">
  //       <button className="EditProfile-submitButton" type="submit">
  //         {saving ? 'Saving...' : 'Save'}
  //       </button>
  //       {saved && (
  //         <div className="EditProfile-saved">Saved</div>
  //       )}
  //     </div>
  //   </fieldset>
  // </form>

  render() {
    const {profile} = this.props;
    const {saving, saved} = this.state;
    const flexbox = {
      display: '-webkit-flex',
      display: '-ms-flexbox',
      display: 'flex',
      overflow: 'hidden',
    };
    const centerPaper = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    const paperStyle = {
      width: 800,
      margin: 35,
      overflow: 'auto',
      backgroundColor: '#FFDB77'
    };
    const barStyle = {
      backgroundColor: '#867DCC',
      fontFamily: 'Nunito',
      color: '#FFDB77'
    };
    const innerPaperStyle = {
      fontFamily: 'Nunito',
      margin: 10,
      overflow: 'auto'
    };
    if (this.state.userProfile && this.state.userProfile.user === undefined) {
      return (
        <div>Loading User Profile...</div>
      );
    }

    if (!this.state.userProfile) {
      return (
        <div>
          Loading Profile...
        </div>
      );
    }
    return (
      <div className={flexbox}>

        <div className="col-md-4">
          {this.renderProfileCard()}
        </div>

        <div className="col-md-8">
          <div style={centerPaper}>
            <Paper style={paperStyle} zDepth={1}>
              <Tabs inkBarStyle={{backgroundColor: 'black'}}>
                <Tab style={barStyle} label="Affirmations">
                  <div style={innerPaperStyle}>
                    {this.renderPostList()}
                  </div>
                </Tab>
                <Tab style={barStyle} icon={<ActionSettings />} >
                  {this.renderProfilePaper()}
                </Tab>
              </Tabs>
              <Divider />
            </Paper>
          </div>
        </div>

      </div>
    );
  }
}

export default connectProfile(EditProfile);
