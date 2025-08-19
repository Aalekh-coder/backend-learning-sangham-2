
const urlVersioning = (version) => (req, res, next) => {
  if (req.path.startWith(`/api/${version}`)) {
    next();
  } else {
    res.status(404).json({
      success: false,
      error: "Api version is not supported",
    });
  }
};

const headerVersioning = (version) => (req) => {
  if (req.get("Accept-Version") === version) {
    next();
  } else {
    res.status(404).json({
      success: false,
      error: "Api version is not supported",
    });
  }
};

const contentTypeVersioninig = (version) => (req, res, next) => {
  const contentType = req.get("Content-Type");

  if(contentType && contentType.includes(`application/vnd.api.${version}+json`)){
    next()
  }else{
    req.status(404).json({
        success:false,
        error:"Api version is not supported"
    })
  }
};

module.exports={
    urlVersioning,headerVersioning,contentTypeVersioninig
}