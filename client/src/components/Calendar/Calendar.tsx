// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, Dimensions,
  Animated, Image, TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import styles from './CalendarStyles';
import { isUserSelectingMenu } from '../../redux/actions/userActions';
import {
  Props, CalendarDayBackgroundColor, Week, UserReducer, Days,
} from '../Interfaces/CalendarInterfaces';

let swipeCalendarPosition = 0;
let firstTimeEntering = true;
let currentPositionInCalendar = 1;

function Calendar({ user, actions, navigation } : Props) {
  const { width } = Dimensions.get('window');

  const now = new Date();
  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsAndLength = [
    { month: 'January', length: 31 },
    { month: 'February', length: 28 },
    { month: 'March', length: 31 },
    { month: 'April', length: 30 },
    { month: 'May', length: 31 },
    { month: 'June', length: 30 },
    { month: 'July', length: 31 },
    { month: 'August', length: 31 },
    { month: 'September', length: 30 },
    { month: 'October', length: 31 },
    { month: 'November', length: 30 },
    { month: 'December', length: 31 },
  ];

  const getCurrentDate = () => {
    const { month } = monthsAndLength[now.getMonth()];
    const dayOfTheMonth = now.getDate();
    const dayOfTheWeekNumber = now.getDay();
    const dayOfTheWeekName = daysOfTheWeek[dayOfTheWeekNumber];

    return {
      month, dayOfTheMonth, dayOfTheWeekNumber, dayOfTheWeekName,
    };
  };

  const currentDate = getCurrentDate();

  const calendar: JSX.Element[] = [];
  const days: Days[] = [];
  const [
    calendarDayBackgroundColor,
    setCalendarDayBackgroundColor] = useState<CalendarDayBackgroundColor>({});
  const calendarDaysBackgroundColor: { [x: string]: string; }[] = [];
  let initialPosition: number;

  const getCalendarMonthsNumbers = () => {
    const arrayOfMonths: number[] = [];
    const firstMonthNumber = now.getMonth();
    let monthNumber = firstMonthNumber;

    for (let i = 0; i < 3; i += 1) {
      if (!monthNumber) {
        monthNumber = firstMonthNumber + 11;
        arrayOfMonths.push(monthNumber);
      } else if (monthNumber > 10) {
        arrayOfMonths.push(monthNumber - 12 + i);
      } else {
        monthNumber = firstMonthNumber + i;
        arrayOfMonths.push(monthNumber);
      }
    }
    return arrayOfMonths;
  };

  const getCalendarDays = (arrayOfMonths: number[]) => {
    arrayOfMonths.forEach((month: number) => {
      let firstMonday = false;
      let lastSunday = false;
      let lastMonthSundays = 0;

      const determineYearOffset = () => {
        if (arrayOfMonths[0] > arrayOfMonths[1] && monthsAndLength[month].month === 'December') {
          return -1;
        } if (arrayOfMonths[1] > arrayOfMonths[2] && monthsAndLength[month].month === 'January') {
          return 1;
        }
        return 0;
      };

      for (let i = 1; i < monthsAndLength[month].length + 1; i += 1) {
        const date = new Date(`${monthsAndLength[month].month} ${i}, ${now.getFullYear() + determineYearOffset()} 00:00:00`);
        if (arrayOfMonths[0] === month && !firstMonday) {
          if (date.getDay() === 1) {
            days.push({ day: i, month: monthsAndLength[month].month });
            firstMonday = true;
          }
        } else if (arrayOfMonths[arrayOfMonths.length - 1] === month && !lastSunday) {
          if (date.getDay() === 0) {
            lastMonthSundays += 1;
            if (lastMonthSundays === 4) {
              days.push({ day: i, month: monthsAndLength[month].month });
              lastSunday = true;
              break;
            }
          }
          days.push({ day: i, month: monthsAndLength[month].month });
        } else if (!lastSunday) {
          days.push({ day: i, month: monthsAndLength[month].month });
        }
      }
    });
  };

  const generateCalendar = () => {
    const arrayOfMonths = getCalendarMonthsNumbers();
    getCalendarDays(arrayOfMonths);

    const firstWeek: Week = {
      firstDay: 0,
      lastDay: 7,
      daysArray: [],
    };
    const lastWeek: Week = {
      firstDay: 7,
      lastDay: 14,
      daysArray: [],
    };
    let newMonth: Days[];

    const determineMonthName = () => {
      const currentCalendarDays: Days[] = days
        .slice(firstWeek.firstDay, lastWeek.lastDay);
      const goToNextMonth = currentCalendarDays[0].month
        !== currentCalendarDays[currentCalendarDays.length - 1].month;

      if (goToNextMonth) {
        newMonth = currentCalendarDays
          .filter((day, index, array) => array[array.length - 1].month === day.month);
      }

      let monthName: {};
      if (newMonth && newMonth.length > 7) {
        monthName = newMonth[0].month;
      } else if (newMonth && newMonth.length === 7 && goToNextMonth) {
        monthName = `${currentCalendarDays[0].month}/${newMonth[0].month}`;
      } else {
        monthName = currentCalendarDays[0].month;
      }

      return monthName;
    };

    for (let i = 0; i < days.length / 14; i += 1) {
      const monthName = determineMonthName();

      const calendarDateWidth = width / 7;
      const selectedCalendarDateWidthAndHeight = calendarDateWidth * 0.75;

      (function completeCalendarLastWeek() {
        [firstWeek, lastWeek].forEach((week) => {
          week.daysArray = days.slice(week.firstDay, week.lastDay);
          let dayNumber = 1;
          for (let j = week.daysArray.length; j < 7; j += 1) {
            week.daysArray.push({
              day: dayNumber,
              month: monthsAndLength[arrayOfMonths.length - 1].month,
            });
            dayNumber += 1;
          }
        });
      }());

      calendar.push(
        <View key={Math.random() * Date.now()}>
          <View style={styles.header}>
            <Text style={{ color: 'white', fontSize: 25 }}>
              {monthName}
            </Text>
          </View>
          <View style={[styles.weekContainer, { width }]}>
            {firstWeek.daysArray.map((day) => (
              <TouchableWithoutFeedback
                key={Math.random() * Date.now()}
                onPress={() => {
                  const previousMarkedDate = Object.keys(calendarDayBackgroundColor)
                    .find((key) => calendarDayBackgroundColor[key] === 'black');
                  setCalendarDayBackgroundColor({
                    ...calendarDayBackgroundColor,
                    [`${previousMarkedDate}`]: 'rgb(58, 58, 58)',
                    [`${monthName}${day.day}`]: 'black',
                  });
                }}
              >
                <View style={[styles.dayWrapper, { width: calendarDateWidth }]}>
                  <Text style={{
                    backgroundColor: calendarDayBackgroundColor
                      ? calendarDayBackgroundColor[`${monthName}${day.day}`]
                      : 'rgb(58, 58, 58)',
                    width: selectedCalendarDateWidthAndHeight,
                    height: selectedCalendarDateWidthAndHeight,
                    borderRadius: selectedCalendarDateWidthAndHeight / 2,
                    lineHeight: selectedCalendarDateWidthAndHeight,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 20,
                  }}
                  >
                    {day.day}
                  </Text>
                  <Text style={{ fontSize: 0 }}>
                    {currentDate.month === monthName && currentDate.dayOfTheMonth === day.day
                      ? (initialPosition = i, calendarDaysBackgroundColor.push({ [`${monthName}${day.day}`]: 'black' }))
                      : calendarDaysBackgroundColor.push({ [`${monthName}${day.day}`]: 'rgb(58, 58, 58)' })}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
          <View style={{ flexDirection: 'row', width }}>
            {lastWeek.daysArray.map((day) => (
              <TouchableWithoutFeedback
                key={Math.random() * Date.now()}
                onPress={() => {
                  const previousWhiteDate = Object.keys(calendarDayBackgroundColor)
                    .find((key) => calendarDayBackgroundColor[key] === 'black');
                  setCalendarDayBackgroundColor({
                    ...calendarDayBackgroundColor,
                    [`${previousWhiteDate}`]: 'rgb(58, 58, 58)',
                    [`${monthName}${day.day}`]: 'black',
                  });
                }}
              >
                <View style={[styles.dayWrapper, { width: calendarDateWidth }]}>
                  <Text style={{
                    backgroundColor: calendarDayBackgroundColor
                      ? calendarDayBackgroundColor[`${monthName}${day.day}`] : 'rgb(58, 58, 58)',
                    width: selectedCalendarDateWidthAndHeight,
                    height: selectedCalendarDateWidthAndHeight,
                    borderRadius: selectedCalendarDateWidthAndHeight / 2,
                    lineHeight: selectedCalendarDateWidthAndHeight,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 20,
                  }}
                  >
                    {day.day}
                  </Text>
                  <Text style={{ fontSize: 0 }}>
                    {currentDate.month === monthName && currentDate.dayOfTheMonth === day.day
                      ? (initialPosition = i, calendarDaysBackgroundColor.push({ [`${monthName}${day.day}`]: 'black' }))
                      : calendarDaysBackgroundColor.push({ [`${monthName}${day.day}`]: 'rgb(58, 58, 58)' })}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
        ,
      );

      [firstWeek, lastWeek].forEach((week) => {
        week.firstDay += 14;
        week.lastDay += 14;
      });
    }
  };

  useEffect(() => {
    const initialState = {};
    calendarDaysBackgroundColor.forEach((date) => Object.assign(initialState, date));
    setCalendarDayBackgroundColor(initialState);
  }, []);

  const horizontalCalendarRef = useRef(null);
  const swipeCalendarAnimation = useRef(new Animated.Value(0)).current;

  const swipeCalendar = async (toTheLeft: boolean, initialEffect: boolean) => {
    if (toTheLeft) {
      if (currentPositionInCalendar !== calendar.length - 1) {
        currentPositionInCalendar += 1;
        swipeCalendarPosition -= initialEffect ? width * initialPosition : width;
      }
    } else if (currentPositionInCalendar) {
      swipeCalendarPosition += width;
      currentPositionInCalendar -= 1;
    }

    Animated.timing(
      swipeCalendarAnimation,
      {
        toValue: swipeCalendarPosition,
        duration: 500,
        useNativeDriver: true,
      },
    ).start();
  };

  generateCalendar();

  if (firstTimeEntering) {
    swipeCalendar(true, true);
    firstTimeEntering = false;
  }

  const dateMarked = Object.keys(calendarDayBackgroundColor).find((key) => calendarDayBackgroundColor[key] === 'black');
  const menuFound = user.menus.find((menu: Object) => Object.keys(menu)[0] === dateMarked);

  return (
    <View style={{ marginTop: StatusBar.currentHeight }} testID="test">
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <GestureRecognizer
        onSwipeLeft={() => swipeCalendar(true, false)}
        onSwipeRight={() => swipeCalendar(false, false)}
        style={{ flexDirection: 'row' }}
      >
        <Animated.View
          ref={horizontalCalendarRef}
          style={{ transform: [{ translateX: swipeCalendarAnimation }], flexDirection: 'row' }}
        >
          {calendar}
        </Animated.View>
      </GestureRecognizer>
      <>
        {menuFound ? (
          <>
            <View style={{ height: 20, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }} />
            <ScrollView
              style={{ marginBottom: 210, paddingTop: 5 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ paddingBottom: 40 }}>
                {['Breakfast', 'Lunch', 'Dinner'].map((menu) => (
                  <View key={Math.random() * Date.now()}>
                    <Text style={styles.sectionTitle}>
                      {menu}
                    </Text>
                    {Object.keys(menuFound[Object.keys(menuFound)[0]])
                      .map((recipe) => (menuFound[Object.keys(menuFound)[0]][recipe]
                        .addedTo === menu
                        ? (
                          <View style={{ alignItems: 'center' }} key={Math.random() * Date.now()}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('detail',
                              { recipe: menuFound[Object.keys(menuFound)[0]][recipe].recipe })}
                            >
                              <View
                                style={[styles.menuCard, { flexDirection: 'row', width: width - 30, position: 'relative' }]}
                              >
                                <Image
                                  style={styles.recipeImage}
                                  source={{
                                    uri: menuFound[Object.keys(menuFound)[0]][recipe]
                                      .recipe.strMealThumb,
                                  }}
                                />
                                <View style={styles.recipeNameWrapper}>
                                  <Text style={styles.recipeNameContainer}>
                                    {menuFound[Object.keys(menuFound)[0]][recipe].recipe.strMeal}
                                  </Text>
                                </View>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        ) : null))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        )
          : (
            <>
              <View style={{ alignItems: 'flex-end', padding: 20 }}>
                <View style={styles.addMenuButtonContainer}>
                  <Text
                    style={styles.addMenuButton}
                    onPress={() => {
                      actions.isUserSelectingMenu(true);
                      navigation.navigate('selectMenu', { date: dateMarked });
                    }}
                  >
                    +
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.addMenuText}>
                  No menu on this day. Add one!
                </Text>
              </View>
              <View style={{ position: 'relative', top: -100, alignItems: 'flex-end' }}>
                <View style={{ transform: [{ rotate: '0deg' }], width: 60 }}>
                  <Image
                    style={styles.arrow}
                    source={{ uri: 'https://cdn.fastly.picmonkey.com/content4/previews/infodoodles/infodoodles_41_550.png' }}
                  />
                </View>
              </View>
            </>
          )}
      </>
    </View>
  );
}

function mapStateToProps({ userReducer }: {userReducer: UserReducer}) {
  return {
    user: userReducer.user,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      isUserSelectingMenu,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
