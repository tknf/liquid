import { expect, use } from 'chai'
import * as fs from '../../../src/fs/node'
import * as chaiAsPromised from 'chai-as-promised'
import { Loader } from '../../../src/fs/loader'

use(chaiAsPromised)

describe('fs/loader', function () {
  describe('.candidates()', function () {
    it('should break once found', async function () {
      const loader = new Loader({ relativeReference: true, fs, extname: '' } as any)
      const candidates = [...loader.candidates('./foo/bar', ['/root', '/root/foo'], '/root/current')]
      expect(candidates.join()).to.equal('/root/foo/bar')
    })
  })
})
