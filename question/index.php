<?
header('Content-Type: application/json; charset=utf-8');

// Ajax以外からのアクセスを遮断
$request = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) : '';
if($request !== 'xmlhttprequest') {
  echo json_encode(array("success" => false));
  exit;
}

// Ajaxからのアクセスがあれば以下を実行
$json = file_get_contents('php://input');
$data = json_decode($json, true);
if (isset($data["message"]) && $data["message"] !== "") {
  $answer = answer(htmlspecialchars($data["message"]));
  $result = array(
    "success" => true,
    "answer" => $answer
  );
} else {
  $result = array("success" => false);
}
$json = json_encode($result);
echo $json;
exit;

function answer($question) {
  return $question;
}
