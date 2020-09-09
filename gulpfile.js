/* eslint-disable no-console */
const path = require('path')
const {
  task,
  src,
  dest,
  series
} = require('gulp')
const fs = require('fs-extra')
const zip = require('gulp-zip')

const distPath = './dist/'
const excluded = [
  'index.html',
  'config.json',
  'favicon.ico',
  '_nuxt'
]

task('pack', (callback) => {
  src(`${distPath}**`)
    .pipe(zip(`${process.env.cinema}.zip`))
    .pipe(dest('builds'))

  callback()
})

task('clean', (callback) => {
  excluded.push(process.env.cinema)

  const files = fs.readdirSync(distPath)
  files.forEach((file) => {
    if (excluded.includes(file)) return true

    fs.removeSync(path.join(distPath, file))

    return true
  })

  callback()
})

task('build', series('clean', 'pack'))
