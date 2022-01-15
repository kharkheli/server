const path = require('path')

const uploadImage = async (req, res) => {
  const image = req.files.image
  const imageName = new Date().getTime() + image.name
  const imagePath = path.join(__dirname, '../public/images/' + imageName)

  await image.mv(imagePath)
  // adding unique identifier for images so there wont be conflict about image names
  res.status(200).json({ path: 'images/' + imageName })
}

module.exports = uploadImage
