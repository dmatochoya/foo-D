import React, {
  useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, View, Text, StatusBar, Dimensions, ScrollView, Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { deleteProductFromGorceryList, deleteAllProductsFromGorceryList } from '../../redux/actions/groceryListActions';
import AddIngredientBoxInput from './TextInput';
import Navbar from '../Navbar/Navbar';

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    top: 0,
    zIndex: 1,
    width: '100%',
    backgroundColor: 'rgb(230, 84, 84)',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  headerTitleAndIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionTitleContainer: {
    marginTop: 17,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgb(161, 117, 81)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientContainer: {
    marginHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.2,
    marginVertical: 1,
    position: 'relative',
  },
});

interface Actions {
    deleteProductFromGorceryList(foodGroupItem: string): void
    deleteAllProductsFromGorceryList(): void
}

interface Props {
  groceryList: object[]
  actions: Actions
}

function List({ groceryList, actions } : Props) {
  const searchBoxRef = useRef();
  const { width, height } = Dimensions.get('window');
  const [sectionArrowDirection, setSectionArrowDirection] = useState<Object>({});
  const [sectionVisibility, setSectionVisibility] = useState<Object>({});
  const [ingredientCrossedOver, setIngredientCrossedOver] = useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    Object.keys(sectionArrowDirection).forEach((section) => {
      setSectionArrowDirection({ [section]: 'arrow-down' });
      setSectionVisibility({ [section]: 'flex' });
    });
  }, [isFocused]);

  const groceryListJSX: JSX.Element[] = [];
  const listOrderedByFoodType: Object = {};
  const sectionArrowDirectionObject: Object = {};
  const sectionVisibilityObject: Object = {};

  const orderItemsByFoodType = () => {
    let sectionNumber = 0;
    groceryList.forEach((listItem: Object) => {
      if (listItem.type in listOrderedByFoodType) {
        listOrderedByFoodType[listItem.type].push(listItem.product);
      } else {
        listOrderedByFoodType[listItem.type] = [listItem.product];
        sectionArrowDirectionObject[sectionNumber] = 'arrow-down';
        sectionVisibilityObject[sectionNumber] = { display: 'flex' };
        sectionNumber += 1;
      }
    });
  };

  const addItemsToList = () => {
    Object.entries(listOrderedByFoodType).forEach((foodGroup, sectionIndexNumber) => {
      groceryListJSX.push(
        <View key={Math.random() * Date.now()}>
          <View style={styles.sectionTitleContainer}>
            <Text style={{ fontSize: 20, color: 'white' }}>
              {`${foodGroup[0].toUpperCase()} (${foodGroup[1].length})`}
            </Text>
            <View style={{ position: 'relative', top: 2 }}>
              <Icon
                onPress={() => {
                  if (sectionArrowDirection[sectionIndexNumber] === 'arrow-down' || !sectionArrowDirection[sectionIndexNumber]) {
                    setSectionArrowDirection({ ...sectionArrowDirection, [sectionIndexNumber]: 'arrow-up' });
                    setSectionVisibility({ ...sectionVisibility, [sectionIndexNumber]: { display: 'none' } });
                  } else {
                    setSectionArrowDirection({ ...sectionArrowDirection, [sectionIndexNumber]: 'arrow-down' });
                    setSectionVisibility({ ...sectionVisibility, [sectionIndexNumber]: { display: 'flex' } });
                  }
                }}
                size={25}
                color="white"
                name={sectionArrowDirection[sectionIndexNumber] ? `ios-${sectionArrowDirection[sectionIndexNumber]}` : 'ios-arrow-down'}
                type="ionicon"
              />
            </View>
          </View>
          <View style={[sectionVisibility[sectionIndexNumber], { marginTop: 5 }]}>
            {foodGroup[1].map((foddGroupItem: string) => (
              <Swipeable
                key={Math.random() * Date.now()}
                renderLeftActions={() => <View style={{ width }} />}
                onSwipeableLeftOpen={() => {
                  actions.deleteProductFromGorceryList(foddGroupItem);
                }}
              >
                <View style={styles.ingredientContainer}>
                  <Text style={{ fontSize: 17, textDecorationLine: ingredientCrossedOver ? 'line-through' : 'none' }} onPress={() => setIngredientCrossedOver(!ingredientCrossedOver)} suppressHighlighting>
                    {`${foddGroupItem[0].toUpperCase()}${foddGroupItem.slice(1)}`}
                  </Text>
                </View>
              </Swipeable>
            ))}
          </View>
        </View>,
      );
    });
  };

  if (groceryList.length) {
    orderItemsByFoodType();
    addItemsToList();
  }

  useEffect(() => {
    if (Object.keys(sectionArrowDirectionObject).length) {
      setSectionArrowDirection(sectionArrowDirectionObject);
      setSectionVisibility(sectionVisibilityObject);
    }
  }, []);

  const deleteAllItemsAlert = () => Alert.alert(
    'Are you sure you want to delete all items from the list?',
    '',
    [
      { text: 'Yes', onPress: () => actions.deleteAllProductsFromGorceryList() },
      { text: 'No' },
    ],
    { cancelable: false },
  );

  return (
    <>
      <View style={{ marginTop: StatusBar.currentHeight, flex: 1 }}>
        <StatusBar backgroundColor="black" barStyle="light-content" translucent />
        <View style={styles.header}>
          <View style={styles.headerTitleAndIconContainer}>
            <Text style={{ color: 'white', fontSize: 25, paddingVertical: 10 }}>
              Grocery list
            </Text>
            <Icon
              size={30}
              color="white"
              name="md-trash"
              type="ionicon"
              onPress={() => {
                if (groceryList.length) {
                  deleteAllItemsAlert();
                }
              }}
            />

          </View>
          <View style={styles.inputBox}>
            <AddIngredientBoxInput searchBoxRef={searchBoxRef} />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {groceryList.length
            ? <View style={{ marginBottom: 60 }}>{groceryListJSX}</View>
            : (
              <View style={{ height: height - 169, justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, textAlign: 'center' }}>
                  No items yet
                </Text>
              </View>
            )}
        </ScrollView>
      </View>
      <Navbar />
    </>
  );
}

function mapStateToProps({ groceryListReducer }
    : { groceryListReducer: object}) {
  return {
    groceryList: groceryListReducer,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      deleteProductFromGorceryList,
      deleteAllProductsFromGorceryList,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
