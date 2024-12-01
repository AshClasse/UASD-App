import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Noticias from "./screens/Noticias";
import Tareas from "./screens/Tareas";
import Materias from "./screens/Materias";
import Solicitudes from "./screens/Solicitudes";

const Drawer = createDrawerNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login">
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Noticias" component={Noticias} />
        <Drawer.Screen name="Tareas" component={Tareas} />
        <Drawer.Screen name="Materias" component={Materias} />
        <Drawer.Screen name="Solicitudes" component={Solicitudes} />
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
