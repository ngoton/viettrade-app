import React from "react";

import {onSignOut} from "../Components/Auth";
import Wallpaper from '../Components/Wallpaper';
import Logo from '../Components/Logo';
import Form from '../Components/Form';
import SignupSection from '../Components/SignupSection';

export default class LoginScreen extends React.Component {
  componentDidMount() {
    onSignOut();
  }
  render() {
    const { navigation } = this.props;
    return (
    
      <Wallpaper>
        <Logo />
        <Form navigation={navigation} />
        //<SignupSection />
      </Wallpaper>
    
    );
  }
}
