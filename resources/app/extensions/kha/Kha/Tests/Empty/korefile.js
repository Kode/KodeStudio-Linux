var solution = new Solution('Empty');
var project = new Project('Empty');
project.targetOptions = {"flash":{},"android":{}};
project.setDebugDir('../../build/windows');
project.addSubProject(Solution.createProject('C:/Users/Robert/Projekte/BlocksFromHeaven/Kha/build/windows-build'));
project.addSubProject(Solution.createProject('C:/Users/Robert/Projekte/BlocksFromHeaven/Kha'));
project.addSubProject(Solution.createProject('C:/Users/Robert/Projekte/BlocksFromHeaven/Kha/Kore'));
solution.addProject(project);
return solution;
