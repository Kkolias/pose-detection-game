export function notUnvantedConnection(keyPoint1Name, keyPoint2Name) {
  return (
    notShoulderToShlouder(keyPoint1Name, keyPoint2Name) &&
    notShoulderToHip(keyPoint1Name, keyPoint2Name) &&
    notHipToHip(keyPoint1Name, keyPoint2Name)
  );
}

function notShoulderToShlouder(keyPoint1Name, keyPoint2Name) {
  return (
    [keyPoint1Name, keyPoint2Name].sort().join("_") !==
    "left_shoulder_right_shoulder"
  );
}

function notShoulderToHip(keyPoint1Name, keyPoint2Name) {
  const nameCombination = [keyPoint1Name, keyPoint2Name].sort().join("_");

  return (
    nameCombination !== "left_hip_left_shoulder" &&
    nameCombination !== "right_hip_right_shoulder"
  );
}

function notHipToHip(keyPoint1Name, keyPoint2Name) {
  return (
    [keyPoint1Name, keyPoint2Name].sort().join("_") !== "left_hip_right_hip"
  );
}
