import { createContext } from "react";

const CurrentGoalContext = createContext({ currentGoal: null, setCurrentGoal: () => {} });

export default CurrentGoalContext;
