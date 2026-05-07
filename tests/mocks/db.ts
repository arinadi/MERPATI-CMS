import { vi } from 'vitest';

/**
 * A robust Drizzle-like chainable mock.
 * It uses .then() to resolve the value, allowing for 'await db...'
 */
const createChainableMock = () => {
  const mock: any = vi.fn();
  
  const methods = [
    'select', 'from', 'where', 'orderBy', 'limit', 'offset',
    'insert', 'values', 'update', 'set', 'delete', 'innerJoin',
    'leftJoin', 'rightJoin', 'fullJoin', 'returning', 'all', 'run', 'get',
    'onConflictDoUpdate', 'onConflictDoNothing'
  ];

  methods.forEach(method => {
    mock[method] = vi.fn().mockImplementation(() => mock);
  });

  // Default terminal behavior
  mock.then = vi.fn().mockImplementation((onfulfilled) => {
    return Promise.resolve([]).then(onfulfilled);
  });

  mock.catch = vi.fn().mockImplementation((onrejected) => {
    return Promise.resolve([]).catch(onrejected);
  });

  // Utility to set the next result
  mock._setResolvedValue = (value: any) => {
    mock.then.mockImplementationOnce((onfulfilled: any) => {
      return Promise.resolve(value).then(onfulfilled);
    });
  };

  mock._setRejectedValue = (error: any) => {
    mock.then.mockImplementationOnce((_onfulfilled: any, onrejected: any) => {
      return Promise.reject(error).catch(onrejected);
    });
  };

  return mock;
};

export const dbMock = createChainableMock();
