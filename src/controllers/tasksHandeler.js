import { Tasks } from "../models/tasksModel.js";

// get All tasks
const getAllTasks = async (req, res, next) => {
  const id = req.user.id;
  // console.log("get userid", id);

  try {
    const allTasks = await Tasks.find({ UserId: id })
      .lean()
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "successfully get all tasks!",
      result: allTasks?.length,
      allTasks,
    });
  } catch (error) {
    next(error);
  }
};

// get a single task
const getTask = async (req, res, next) => {
  const UserId = req.user.id;
  // console.log("get userid", UserId);
  const { id } = req.params;
  // console.log("id :", id);
  try {
    const task = await Tasks.findOne({ UserId: UserId, _id: id }).lean();
    // console.log("task", task);

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }
    res.status(200).json({ message: "successfully get a task!", task });
  } catch (error) {
    next(error);
  }
};

// create a task
const createTask = async (req, res, next) => {
  const {
    title,
    description,
    tags,
    priority,
    recurrence,
    notification,
    dueDate,
  } = req.body;

  // console.log("get userid", req.user.id);

  const myTask = {
    UserId: req.user.id,
    title,
    description,
    tags,
    priority,
    recurrence,
    notification,
    dueDate,
  };

  if (recurrence && recurrence.enabled === false) {
    delete myTask.recurrence;
  }

  if (notification && notification.enabled === false) {
    delete myTask.notification;
  }

  try {
    const NewTask = new Tasks(myTask);
    const createdTask = await NewTask.save();
    // console.log("createdTask", createdTask);
    res
      .status(201)
      .json({ message: "task is successfully created!", createdTask });
  } catch (error) {
    next(error);
  }
};

// update a task
const updateTask = async (req, res, next) => {
  const UserId = req.user.id;
  console.log("get userid", UserId);

  const { id } = req.params;
  const { status, ...body } = req.body;
  try {
    const checkStatus = await Tasks.findOne({ UserId: UserId, _id: id });
    if (!checkStatus) {
      return res.status(404).json({ message: "Task not found!" });
    }
    // console.log("currentStatus", checkStatus.status);

    // If the status is "ongoing", call the taskStart method
    if (status === "ongoing") {
      if (checkStatus.status === "pending") {
        const startTask = await checkStatus.taskStart();
        return res.status(200).json({ message: "Task is started!", startTask });
      } else {
        return res
          .status(400)
          .json({ message: "Task is already started or completed!" });
      }
    }

    // If the status is "completed", call the markAsCompleted method
    if (status === "completed") {
      if (checkStatus.status === "ongoing") {
        const taskCompleted = await checkStatus.markAsCompleted(); // Will update status, isCompleted, completedAt
        return res
          .status(200)
          .json({ message: "Task is completed!", taskCompleted });
      } else {
        return res.status(400).json({
          message: "Task cannot be marked as completed unless it is ongoing!",
        });
      }
    }

    // Otherwise, update other fields (except status)
    const updatedTask = await Tasks.findByIdAndUpdate(id, body, { new: true });
    updatedTask.updatedAt = new Date();
    updatedTask.isUpdated = true;
    await updatedTask.save();

    return res
      .status(200)
      .json({ message: "Task updated successfully!", updatedTask });
  } catch (error) {
    console.log("Error: ", error);
    next(error);
  }
};

// delete a task
const deleteTask = async (req, res, next) => {
  const UserId = req.user.id;
  const { id } = req.params;
  // console.log("id :", id);
  try {
    if (!id) {
      return res.status(404).json({ message: "ID not found!" });
    }
    const task = await Tasks.findByIdAndDelete({
      UserId: UserId,
      _id: id,
    }).lean();
    // console.log("task", task);

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }
    // console.log("task :", task);
    res.status(200).json({ message: "Task deleted successfully!", task });
  } catch (error) {
    next(error);
  }
};

export { getAllTasks, getTask, createTask, updateTask, deleteTask };
