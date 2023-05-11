import { Draggable, Droppable } from "react-beautiful-dnd";
import Backlog from "../assets/Backlog";
import Done from "../assets/Done";
import ToDo from "../assets/ToDo";
import InProgress from "../assets/InProgress";

const TaskList = ({ name, items, id }) => {
  const viewIcon = (type) => {
    if (type === "Backlog") return <Backlog />;
    if (type === "To Do") return <ToDo />;
    if (type === "In Progress") return <InProgress />;
    if (type === "Done") return <Done />;
  };

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="list-item"
        >
          <div className="store-container">
            <h3 className="title">{name}</h3>
          </div>
          <div className="items-container">
            {items.map((item, index) => (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided, snapshot) => (
                  <div
                    className="item-container"
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? "0.5" : "1",
                    }}
                  >
                    <div className="svg-icon">{viewIcon(id)}</div>
                    <h4>{item.name}</h4>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;
