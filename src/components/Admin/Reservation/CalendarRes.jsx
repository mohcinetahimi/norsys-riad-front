import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { format, startOfToday, eachDayOfInterval, startOfMonth, endOfMonth, endOfWeek, isToday, isSameMonth, isEqual, add, parse, getDay, isSameDay } from 'date-fns';
import { useState } from 'react';

const meetings = [
  {
    id: 1,
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    start: '1:00 PM',
    startDatetime: '2022-01-21T13:00',
    end: '2:30 PM',
    endDatetime: '2022-01-21T14:30',
  },
  {
    id: 2,
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    start: '1:00 PM',
    startDatetime: '2024-08-01T13:00',
    end: '2:30 PM',
    endDatetime: '2024-08-01T14:30',
  },
  {
    id: 4,
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    start: '1:00 PM',
    startDatetime: '2024-08-31T13:00',
    end: '2:30 PM',
    endDatetime: '2024-08-31T14:30',
  },
  
  {
    id: 4,
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    start: '1:00 PM',
    startDatetime: '2024-08-1T13:00',
    end: '2:30 PM',
    endDatetime: '2024-08-1T14:30',
  }
  // More meetings...
];

function Meeting({ meeting }) {
  return (
    <li key={meeting.id} className="group flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100">
      <img src={meeting.imageUrl} alt="" className="h-10 w-10 flex-none rounded-full" />
      <div className="flex-auto">
        <p className="text-gray-900">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>{meeting.start}</time> -{' '}
          <time dateTime={meeting.endDatetime}>{meeting.end}</time>
        </p>
      </div>
      <Menu as="div" className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100">
        <div>
          <MenuButton className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
          </MenuButton>
        </div>

        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                  >
                    Edit
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                  >
                    Cancel
                  </a>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </li>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  let newDays = eachDayOfInterval({
    start: startOfMonth(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  const nextMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  };

  const previousMonth = () => {
    let firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, 'MMM-yyyy'));
  };

  const filteredMeetings = meetings.filter(meeting => 
    isSameDay(parse(meeting.startDatetime, 'yyyy-MM-dd\'T\'HH:mm', new Date()), selectedDay)
  );

  return (
    <div className="p-16">
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        <div className="md:pr-14">
          <div className="flex items-center">
            <h2 className="flex-auto text-sm font-semibold text-gray-900">
              {format(firstDayCurrentMonth, 'MMMM yyyy')}
            </h2>
            <button
              type="button"
              onClick={previousMonth}
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="mt-2 grid grid-cols-7 text-sm">
            {newDays.map((day, dayIdx) => (
              <div key={day.toString()} className={classNames(
                dayIdx > 6 && 'border-t border-gray-200',
                dayIdx === 0 && colStartClasses[getDay(day)], 'py-2')}>
                <button
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={classNames(
                    isEqual(day, selectedDay) && 'text-white',
                    !isEqual(day, selectedDay) && isToday(day) && 'text-indigo-600',
                    !isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && 'text-gray-900',
                    !isEqual(day, selectedDay) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && 'text-gray-400',
                    isEqual(day, selectedDay) && isToday(day) && 'bg-indigo-600',
                    isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900',
                    !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                    (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                  )}
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                </button>
              </div>
            ))}
          </div>
        </div>
        <section className="mt-12 md:mt-0 md:pl-14">
          <h2 className="text-base font-semibold text-gray-900">
            Schedule for <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>{format(selectedDay, 'MMM dd, yyy')}</time>
          </h2>
          <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map(meeting => <Meeting meeting={meeting} key={meeting.id} />)
            ) : (
              <p>No meetings for today.</p>
            )}
          </ol>
        </section>
      </div>
    </div>
  );
}
let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];
