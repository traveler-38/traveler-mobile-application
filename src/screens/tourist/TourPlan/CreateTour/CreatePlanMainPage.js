import React, { useState, useEffect } from "react";
import { SearchBar } from "react-native-elements";
import {
  images,
  SIZES,
  COLORS,
  FONTS,
  localhost,
  GOOGLE_API_KEY,
} from "../../../../constants/index";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Button,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import colors from "../../../../assets/asse/colors/colors";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geocoder from "react-native-geocoding";

const TourPlanMap = ({ route, navigation }) => {
  //getting async storage data
  const [userToken, setToken] = useState(null);
  const [userEmail, setEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [tourId, setTourId] = useState(null);
  const [tourprofileid, settourprofileid] = useState(null);
  const [isloadingCreateTour, setIsloadingCreateTour] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectLocationList, setSelectLocationList] = useState(null);
  const [removeLocationId, setRemoveLocationId] = useState(null);
  useEffect(() => {
    let { object_id, tourprofileid } = route.params;
    setTourId(object_id);
    settourprofileid(tourprofileid);
    getData();
    getlocations();
  }, []);

  function getlocations() {
    let { object_id, tourprofileid } = route.params;
    // console.log("object_id", object_id);
    // console.log("tourprofileid", tourprofileid);
    fetch(localhost + "/tourplan/locationlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        object_id,
        tourprofileid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        if (result.message === "get_location_details") {
          // console.log(result.tourStart.latitude);
          // console.log(result.tourStart.longitude);
          // console.log(result.tourEnd.latitude);
          console.log(result.selectLocation);
          setSelectLocationList(result.selectLocation);
          setIsloadingCreateTour(false);
        } else {
          console.log(result);
          Alert.alert("No created tours");
        }
      });
  }

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userName = await AsyncStorage.getItem("userName");
      const email = await AsyncStorage.getItem("userEmail");
      setToken(token);
      setEmail(email);
      setUserName(userName);
    } catch (error) {
      console.log(error);
    }
  };
  //getting async storage data

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tourName, setTourName] = useState("laol");

  //add location

  const [selectLocationName, setSelectLocationName] = useState(null);
  const [selectLocationLatitude, setSelectLocationLatitude] = useState(null);
  const [selectLocationLongitude, setSelectLocatinLongitude] = useState(null);

  function popUpAddLocation() {
    //get geocode
    function geocodeSelectLocation(data) {
      Geocoder.init(GOOGLE_API_KEY);
      // Search by address
      Geocoder.from(data.description)
        .then((json) => {
          var location = json.results[0].geometry.location;
          setSelectLocationLatitude(location.lat);
          setSelectLocatinLongitude(location.lng);
        })
        .catch((error) => console.warn(error));
    }
    const AddLocation = async () => {
      if (!selectLocationName) {
        Alert.alert("Enter Location Name");
      } else {
        fetch(localhost + "/tourplan/addnewlocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tourId,
            tourprofileid,
            userEmail,
            tourName,
            selectLocationName,
            selectLocationLatitude,
            selectLocationLongitude,
          }),
        })
          .then((res) => res.json())
          .then(async (result) => {
            if (result.message === "Location added") {
              getlocations();
              setModalVisible(false);
            } else {
              Alert.alert("Tour Location already added");
            }
          });
      }
    };
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.navy,
                  marginTop: -10,
                  marginLeft: 260,
                  fontSize: 25,
                }}
              >
                X
              </Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.navy,
                  textAlign: "center",
                  fontSize: 30,
                  marginTop: -130,
                }}
              >
                Add Location
              </Text>
              <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={{ paddingTop: 10 }}>
                  <Text style={styles.text_footer}>Location: </Text>
                  <View style={styles.action}>
                    <GooglePlacesAutocomplete
                      placeholder="Search"
                      onPress={(data, details = null) => {
                        setSelectLocationName(data.description);
                        geocodeSelectLocation(data);
                      }}
                      query={{
                        key: GOOGLE_API_KEY,
                        language: "en",
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={AddLocation}
            >
              <Text style={styles.textStyle}>Add Location</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    );
  }

  function LoadingIcon() {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isloadingCreateTour}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!isloadingCreateTour);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              flexDirection: "row",
              justifyContent: "space-around",
              padding: 10,
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </Modal>
      </View>
    );
  }
  //add location

  function renderMainButton() {
    // console.log(tourId);
    // console.log(tourprofileid);
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            marginHorizontal: 5,
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: colors.blue,
            // marginLeft: 20,
            // alignItems: "center",
            paddingVertical: 15,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style style={styles.buttonText}>
            Add New Location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: colors.blue,
            // alignItems: "center",
            // marginRight: 10,
            paddingVertical: 15,
          }}
          onPress={() => navigation.navigate("ChatScreen")}
        >
          <Text style style={styles.buttonText}>
            Group Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: colors.blue,
            // alignItems: "center",
            // marginRight: 10,
            paddingVertical: 15,
            borderRadius: 50,
          }}
          // onPress={() => navigation.navigate("FinalizeMapView")}
          onPress={() =>
            navigation.navigate("FinalizeMapView", {
              tourId,
              tourprofileid,
            })
          }
        >
          <Text style style={styles.buttonText}>
            Finalize MapView
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginHorizontal: 1,
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: colors.blue,
            // alignItems: "center",
            // marginRight: 10,
            paddingVertical: 15,
            borderRadius: 50,
          }}
          onPress={() =>
            navigation.navigate("AddMembers", {
              tourId,
              tourprofileid,
            })
          }
        >
          <Text style style={styles.buttonText}>
            Members
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  //renderMainCategory function start
  function renderMainCategories() {
    return (
      <View style={{ padding: SIZES.padding * 2 }}>
        <Text style={{ ...FONTS.h2, textAlign: "center" }}>Plan your tour</Text>
      </View>
    );
  }

  function renderLocationList() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginBottom: SIZES.padding * 2,
          flex: 1,
          // justifyContent: "space-between",
          backgroundColor: "#ffff",
          borderColor: "#000080",
          padding: 25,
          marginLeft: 5,
          marginRight: 5,
          borderRadius: 30,
          marginTop: 20,
        }}
      >
        {/* trip info */}
        <Text style={{ ...FONTS.h4 }}>{item.tourselectLocationName}</Text>
        <View
          style={{
            flexDirection: "row",
            paddingTop: 30,
            justifyContent: "space-between",
          }}
        >
          <Button
            style={{
              fontSize: 20,
              backgroundColor: "02B3C5",
              padding: 90,
              borderRadius: 10,
            }}
            title="Change"
          ></Button>
          <Button
            style={{ fontSize: 20, backgroundColor: "green", padding: 30 }}
            title="Remove"
            // onPress={() => setRemoveModalVisible(true)}
            // onPress={(data, details = null) => {
            //   setRemoveModalVisible(true);
            //   // console.log(data._id);
            //   setRemoveLocationId(data);
            // }}
            onPress={(data, details = null) => {
              setRemoveModalVisible(true);
              // console.log(item._id);
              setRemoveLocationId(item._id);
              // setSelectLocationName(data.description);
              // geocodeSelectLocation(data);
            }}
          ></Button>
        </View>
      </View>
    );

    return (
      <FlatList
        data={selectLocationList}
        keyExtractor={(item) => `${item._id}`}
        renderItem={renderItem}
        contentContainerStyl={{
          paddingHorizontal: SIZES.padding * 2,
          paddingBottom: 30,
        }}
      />
    );
  }

  function popUpRemoveLocation() {
    const RemoveLocationApi = () => {
      fetch(localhost + "/tourplan/removelocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId,
          tourprofileid,
          removeLocationId,
        }),
      })
        .then((res) => res.json())
        .then(async (result) => {
          if (result.message === "remove_location_details") {
            getlocations();
            setRemoveModalVisible(false);
          } else {
            Alert.alert("Tour Location already added");
          }
        });
      // console.log(removeLocationId);
      // console.log("ssssssssaaaaaaawwwwwwww");
      // setRemoveModalVisible(false);
    };

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
        }}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={removeModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setRemoveModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setRemoveModalVisible(false)}>
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.navy,
                  marginTop: -10,
                  marginLeft: 260,
                  fontSize: 25,
                }}
              >
                X
              </Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text
                style={{
                  ...FONTS.h2,
                  color: COLORS.navy,
                  textAlign: "center",
                  fontSize: 20,
                  marginTop: -90,
                  marginBottom: 70,
                }}
              >
                Are you sure remove Location?
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={RemoveLocationApi}
              >
                <Text style={styles.textStyle}>Remove Location</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  //main return
  return (
    <SafeAreaView style={styles.container}>
      {renderMainCategories()}
      {renderMainButton()}
      {renderLocationList()}
      {popUpAddLocation()}
      {popUpRemoveLocation()}
      {LoadingIcon()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDFCFF",
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    margin: 10,
    borderColor: "#000080",
  },
  shadow: {
    shadowColor: "#000080",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },

  //Add location
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    // borderBottomColor: "#f2f2f2",
    paddingBottom: 0,
  },
  textInput: {
    marginTop: Platform.OS === "ios" ? 0 : 12,
    paddingLeft: 10,
    color: "#05375a",
  },
  footer: {
    flex: Platform.OS === "ios" ? 3 : 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 150,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    marginTop: 200,
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    height: 400,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  //Add location
});

export default TourPlanMap;
