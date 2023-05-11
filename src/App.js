import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import initData from "./data/initData.json";
import initRobots from "./data/initRobots.json";
import { format } from "date-fns";
import "./App.css";
import TaskList from "./components/TaskList";

const getRandomFibonacci = () => {
  const fibonacci = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  return fibonacci[Math.floor(Math.random() * 12)];
};

const App = () => {
  const [tasks, setTasks] = useState(initData);
  const [robots, setRobots] = useState(initRobots);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevData) => {
        const newData = [...prevData];

        if (newData[1].items.length > 0) {
          const task = newData[1].items.find((item) => item);
          const available = robots.find((item) => item.busy === false);

          if (task && available) {
            const time = getRandomFibonacci();
            console.log(`${time} second`);
            available.busy = true;
            newData[1].items = newData[1].items.filter(
              (item) => item.id !== task.id
            );
            newData[2].items.push(task);

            setTimeout(() => {
              newData[2].items = newData[2].items.filter(
                (item) => item.id !== task.id
              );
              newData[3].items.push(task);
              setRobots((prevRobots) => {
                const newRobots = [...prevRobots];
                const index = newRobots.findIndex(
                  (item) => item.id === available.id
                );
                newRobots[index] = { ...available, busy: false };
                return newRobots;
              });
            }, time * 1000);
          }
        }

        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, robots]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTask = {
        id: crypto.randomUUID(),
        name: `Task - ${format(new Date(), "dd.MM.yyyy HH:mm:ss")}`,
      };

      setTasks((prevData) => {
        const updatedData = prevData.map((column) => {
          if (column.id === "Backlog") {
            return {
              ...column,
              items: [...column.items, newTask],
            };
          }
          return column;
        });
        return updatedData;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleDragAndDrop = (results) => {
    // console.log(results);
    const { source, destination } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    const storeSourceIndex = tasks.findIndex(
      (store) => store.id === source.droppableId
    );
    const storeDestinationIndex = tasks.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...tasks[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...tasks[storeDestinationIndex].items]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newData = [...tasks];

    newData[storeSourceIndex] = {
      ...tasks[storeSourceIndex],
      items: newSourceItems,
    };
    newData[storeDestinationIndex] = {
      ...tasks[storeDestinationIndex],
      items: newDestinationItems,
    };

    setTasks(newData);
  };

  return (
    <div className="wrapper-kanban">
      <h1 className="title-main">iRobot</h1>
      <DragDropContext onDragEnd={handleDragAndDrop}>
        <div className="card">
          {tasks.map((item) => (
            <div key={item.id} className="task">
              <TaskList {...item} />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
