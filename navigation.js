import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Noticias from "./screens/Noticias";
import Tareas from "./screens/Tareas";
import Materias from "./screens/Materias";
import Solicitudes from "./screens/Solicitudes";
import ForgotPassword from "./screens/ForgotPassword";
import Horarios from "./screens/Horarios";
import Deuda from "./screens/Deuda";
import Eventos from "./screens/Eventos";  
import Videos from "./screens/Videos";
import AcercaDe from "./screens/AcercaDe";
const Drawer = createDrawerNavigator();


const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Iniciar Sesión">
        <Drawer.Screen name="Iniciar Sesión" component={Login} />
        <Drawer.Screen name="Noticias" component={Noticias} />
        <Drawer.Screen name="Eventos" component={Eventos} />
        <Drawer.Screen name="Videos" component={Videos} /> 
        <Drawer.Screen name="Tareas" component={Tareas} />
        <Drawer.Screen name="Materias" component={Materias} />
        <Drawer.Screen name="Horarios" component={Horarios} />
        <Drawer.Screen name="Solicitudes" component={Solicitudes} />
        <Drawer.Screen name="Mi Perfil" component={Profile} />
        <Drawer.Screen name="Deuda" component={Deuda} />
        <Drawer.Screen name="Acerca De" component={AcercaDe} />
        <Drawer.Screen name="Olvidé mi Contraseña" component={ForgotPassword} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};


export default Navigation;
