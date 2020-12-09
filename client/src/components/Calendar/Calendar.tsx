import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, Dimensions, Animated,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
// import Month from './Month';

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(230, 84, 84)',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

let swipped = false;
export default function Calendar() {
  let currentPositionInCalendar = 5;
  let swipeCalendarPosition = 0;
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

  const getWeekOfTheMonth = (dayOfTheWeekNumber: number, dayOfTheMonth: number): number | void => {
    const month = now.getMonth();
    const year = now.getFullYear();
    const checkDate = new Date(year, month, dayOfTheMonth);
    const checkDateTime = checkDate.getTime();
    let currentWeek = 0;

    for (let i = 1; i < 32; i += 1) {
      const loopDate = new Date(year, month, i);

      if (loopDate.getDay() === dayOfTheWeekNumber) {
        currentWeek += 1;
      }

      if (loopDate.getTime() === checkDateTime) {
        return currentWeek;
      }
    }
  };

  const getCurrentDate = () => {
    const { month } = monthsAndLength[now.getMonth()];
    const dayOfTheMonth = now.getDate();
    const dayOfTheWeekNumber = now.getDay();
    const dayOfTheWeekName = daysOfTheWeek[dayOfTheWeekNumber];
    const weekOfTheMonth = getWeekOfTheMonth(dayOfTheWeekNumber, dayOfTheMonth);

    return {
      month, dayOfTheMonth, dayOfTheWeekNumber, dayOfTheWeekName, weekOfTheMonth,
    };
  };

  const currentDate = getCurrentDate();
  // const [date, sateDate] = useState(currentDate);

  const calendar: JSX.Element[] = [];
  const days: Object[] = [];

  const generateCalendar = () => {
    if (currentDate.weekOfTheMonth === 2 || currentDate.weekOfTheMonth === 4) {
      const arrayOfMonths: number[] = [];
      const firstMonthNumber = now.getMonth() - 2;
      let monthNumber = firstMonthNumber;
      for (let i = 0; i < 7; i += 1) {
        if (firstMonthNumber < 1) {
          monthNumber = firstMonthNumber + 12 + i;
          arrayOfMonths.push(firstMonthNumber + 12 + i);
        } else if (monthNumber > 11) {
          arrayOfMonths.push(firstMonthNumber - 12 + i);
        } else {
          monthNumber = firstMonthNumber + i;
          arrayOfMonths.push(firstMonthNumber + i);
        }
      }

      arrayOfMonths.forEach((month: number) => {
        let firstMonday = false;
        let lastSunday = false;
        let lastMonthSundays = 0;
        for (let i = 1; i < monthsAndLength[month - 1].length + 1; i += 1) {
          const dt = new Date(`${monthsAndLength[month - 1].month} ${i}, 2020 23:15:00`);
          if (arrayOfMonths[0] === month && !firstMonday) {
            if (dt.getDay() === 1) {
              days.push({ day: i, month: monthsAndLength[month - 1].month });
              firstMonday = true;
            }
          } else if (arrayOfMonths[arrayOfMonths.length - 1] === month && !lastSunday) {
            if (dt.getDay() === 0) {
              lastMonthSundays += 1;
              if (lastMonthSundays === 4) {
                lastSunday = true;
                break;
              }
            }
            days.push({ day: i, month: monthsAndLength[month - 1].month });
          } else if (!lastSunday) {
            days.push({ day: i, month: monthsAndLength[month - 1].month });
          }
        }
      });

      let firstDayOfFirstWeek = 0;
      let lastDayOfFirstWeek = 7;
      let firstDayOfLastWeek = 7;
      let lastDayOfLastWeek = 14;
      let newMonth;
      for (let i = 0; i < days.length / 14; i += 1) {
        const currentCalendarDays: Object[] = days
          .slice(firstDayOfFirstWeek, lastDayOfLastWeek);
        const goToNextMonth = currentCalendarDays[0].month
        !== currentCalendarDays[currentCalendarDays.length - 1].month;

        if (goToNextMonth) {
          newMonth = currentCalendarDays
            .filter((day, index, array) => array[array.length - 1].month === day.month);
        }

        let monthName;
        if (newMonth && newMonth.length > 7) {
          monthName = newMonth[0].month;
        } else if (newMonth && newMonth.length === 7 && goToNextMonth) {
          monthName = `${currentCalendarDays[0].month}/${newMonth[0].month}`;
        } else {
          monthName = currentCalendarDays[0].month;
        }

        calendar.push(
          <>
            <View key={Math.random() * Date.now()}>
              <View style={styles.header}>
                <Text style={{ color: 'white', fontSize: 25 }}>
                  {monthName}
                </Text>
              </View>

              <View style={{
                flexDirection: 'row', width, height: 50, alignItems: 'center', marginTop: 70,
              }}
              >
                {days.slice(firstDayOfFirstWeek, lastDayOfFirstWeek).map((day) => (
                  <Text
                    key={Math.random() * Date.now()}
                    style={{
                      backgroundColor: 'rgb(58, 58, 58)', width: width / 7, textAlign: 'center', color: 'white', fontSize: 20, borderColor: 'white', borderWidth: StyleSheet.hairlineWidth, height: 50, lineHeight: 50, borderRadius: 3,
                    }}
                  >
                    {day.day}
                  </Text>
                ))}
              </View>
              <View style={{
                flexDirection: 'row', width,
              }}
              >
                {days.slice(firstDayOfLastWeek, lastDayOfLastWeek).map((day) => (
                  <Text
                    key={Math.random() * Date.now()}
                    style={{
                      backgroundColor: 'rgb(58, 58, 58)', width: width / 7, textAlign: 'center', color: 'white', fontSize: 20, borderColor: 'white', borderWidth: StyleSheet.hairlineWidth, borderTopWidth: 0, height: 50, lineHeight: 50, borderRadius: 3,
                    }}
                  >
                    {day.day}
                  </Text>
                ))}
              </View>
            </View>
          </>,
        );
        firstDayOfFirstWeek += 14;
        lastDayOfFirstWeek += 14;
        firstDayOfLastWeek += 14;
        lastDayOfLastWeek += 14;
      }
    }
  };

  const horizontalCalendarRef = useRef(null);
  const isFocused = useIsFocused();

  const swipeCalendarAnimation = useRef(new Animated.Value(0)).current;

  const swipeCalendar = async (toTheLeft: boolean, initialEffect: boolean) => {
    if (toTheLeft) {
      if (currentPositionInCalendar !== calendar.length - 1) {
        currentPositionInCalendar += 1;
        swipeCalendarPosition -= initialEffect ? width * 6 : width;
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

  useEffect(() => {
    swipeCalendar(true, true);
  }, [isFocused]);

  return (
    <View style={{ marginTop: StatusBar.currentHeight }} testID="test">
      <GestureRecognizer
        onSwipeLeft={() => {
          swipped = true;
          swipeCalendar(true, false);
        }}
        onSwipeRight={() => {
          swipped = true;
          swipeCalendar(false, false);
        }}
        style={{ flexDirection: 'row' }}
      >
        <Animated.View
          ref={horizontalCalendarRef}
          style={{ transform: [{ translateX: swipeCalendarAnimation }], flexDirection: 'row' }}
        >
          {calendar}
        </Animated.View>
      </GestureRecognizer>

    </View>
  );
}
