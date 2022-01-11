const images = [
  'https://cdn.pixabay.com/photo/2021/10/19/10/56/cat-6723256_960_720.jpg',
  'https://cdn.pixabay.com/photo/2018/03/31/06/31/dog-3277416_960_720.jpg',
  'https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_960_720.jpg',
  'https://cdn.pixabay.com/photo/2015/04/10/01/41/fox-715588_960_720.jpg',
  'https://cdn.pixabay.com/photo/2018/08/12/16/59/parrot-3601194_960_720.jpg',
  'https://cdn.pixabay.com/photo/2012/06/19/10/32/owl-50267_960_720.jpg',
]

const randomImage = () => {
  const index = Math.floor(Math.random() * images.length)
  return images[index]
}

module.exports = randomImage
