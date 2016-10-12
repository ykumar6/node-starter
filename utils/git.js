const childProcess = require('child_process')

module.exports = () => {
  var gitInfo = {}

  var commands = {
    'name': ['rev-parse', '--abbrev-ref', 'HEAD'],
    'sHA': ['rev-parse', 'HEAD'],
    'shortSHA': ['rev-parse', '--short', 'HEAD'],
    'lastCommitTime': ['log', '--format="%ai"', '-n1', 'HEAD'],
    'lastCommitMessage': ['log', '--format="%B"', '-n1', 'HEAD'],
    'lastCommitAuthor': ['log', '--format="%aN"', '-n1', 'HEAD'],
    'remoteOriginUrl': ['config', '--get-all', 'remote.origin.url']
  }

  Object.keys(commands).forEach(function (cmd) {
    var args = commands[cmd]
    var result = childProcess.spawnSync('git', args)
    if (result.status !== 0) {
      throw new Error('Uh oh! Failed to execute command: ' + result.stderr)
    }

    gitInfo[cmd] = result.stdout
      .toString('utf8')
      .replace(/^\s+|\s+$/g, '')  // Remove newline
      .replace(/^"(.*)"$/, '$1')  // Remove boundary quotes
  })
  return gitInfo
}
