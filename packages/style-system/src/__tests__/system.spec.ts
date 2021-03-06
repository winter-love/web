import {system} from '../system'

const theme = {
  breakpoints: ['500px', '750px', '1200px'],
  foos: {
    foo: '300px',
  },
}

describe('system', () => {
  it('should return style', () => {
    const styleFunction = system({
      foo: {
        defaultScale: {
          foo: '200px',
        },
        property: 'left',
        scale: 'foos',
      },
    })

    expect(styleFunction({foo: 'foo'})).toEqual({
      left: '200px',
    })
  })
  it('should return style with the true property', () => {
    const styleFunction = system({
      left: {
        defaultScale: {
          foo: '200px',
        },
        scale: 'foos',
      },
    })
    expect(styleFunction({left: 'foo'})).toEqual({
      left: '200px',
    })
  })
  it('should return responsive style', () => {
    const styleFunction = system({
      foo: {
        defaultScale: {
          foo: '200px',
        },
        property: 'left',
        scale: 'foos',
      },
    })
    expect(styleFunction({foo: ['foo', '100px', '200px', '300px'], theme})).toEqual({
      '@media screen and (min-width: 1200px)': {
        left: '300px',
      },
      '@media screen and (min-width: 500px)': {
        left: '100px',
      },
      '@media screen and (min-width: 750px)': {
        left: '200px',
      },
      left: '300px',
    })
  })
  it('should return responsive style with 2 props', () => {
    const styleFunction = system({
      bar: {
        defaultScale: {
          foo: '200px',
        },
        property: 'right',
        scale: 'foos',
      },
      foo: {
        defaultScale: {
          foo: '200px',
        },
        property: 'left',
        scale: 'foos',
      },
    })
    expect(styleFunction({bar: '200px', foo: ['foo', '100px', '200px', '300px'], theme})).toEqual({
      '@media screen and (min-width: 1200px)': {
        left: '300px',
      },
      '@media screen and (min-width: 500px)': {
        left: '100px',
      },
      '@media screen and (min-width: 750px)': {
        left: '200px',
      },
      left: '300px',
      right: '200px',
    })
  })
  it('should return responsive style with 2 responsive props', () => {
    const styleFunction = system({
      bar: {
        defaultScale: {
          foo: '200px',
        },
        property: 'right',
        scale: 'foos',
      },
      foo: {
        defaultScale: {
          foo: '200px',
        },
        property: 'left',
        scale: 'foos',
      },
    })
    expect(styleFunction({bar: ['200px', 'foo'], foo: ['foo', '100px', '200px', '300px'], theme})).toEqual({
      '@media screen and (min-width: 1200px)': {
        left: '300px',
      },
      '@media screen and (min-width: 500px)': {
        left: '100px',
        right: '300px',
      },
      '@media screen and (min-width: 750px)': {
        left: '200px',
      },
      left: '300px',
      right: '200px',
    })
  })
  it('should return responsive style with 2 properties', () => {
    const styleFunction = system({
      size: {
        properties: ['width', 'height'],
        scale: 'foos',
      },
    })

    expect(styleFunction({
      size: '300px',
    })).toEqual({
      height: '300px',
      width: '300px',
    })
  })
  it('should return responsive style with 2 properties and 1 property', () => {
    const styleFunction = system({
      size: {
        properties: ['width', 'height'],
        scale: 'foos',
      },
      width: {
        property: 'width',
        scale: 'foos',
      },
    })

    expect(styleFunction({
      size: undefined,
      width: '300px',
    })).toEqual({
      width: '300px',
    })
  })
  it('should return style with __propStylePassThrough__', () => {
    const styleFunction = system({
      foo: {
        defaultScale: {
          foo: '200px',
        },
        property: 'left',
        scale: 'foos',
      },
    })

    expect(styleFunction({foo: 'foo', right: '200px', theme: {__propStylePassThrough__: true}})).toEqual({
      left: '200px',
      right: '200px',
    })
  })
})
