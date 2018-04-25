const config = {
  domainURL: '',
  timeslots: ['8:30 - 9:15', '9:15 - 10:00', '10:15 - 11:00',
  '11:00 - 11:45', '11:45 - 12:30', '12:30 - 13:15', '13:15 - 14:00',
  '14:00 - 14:45', '15:00 - 15:45', '15:45 - 16:30', '16:30 - 17:15',
  '17:15 - 18:00', '18:15 - 19:00', '19:00 - 19:45', '20:00 - 20:45',
  '20:45 - 21:30'],
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  except: [{/*Monday*/}, {/*Tuesday*/}, {/*Wednesday*/}, {/*Thursday*/},
  {/*Friday*/timeslots: [13, 14, 15]},
  {/*Saturday*/timeslots: [12, 13, 14, 15]}]
  //The first timeslot is counted as 0, the second timeslot as 1, the third as 2, etc...
};
