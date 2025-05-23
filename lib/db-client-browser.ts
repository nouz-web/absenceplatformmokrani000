// This is a mock implementation for the browser
export const getDbClient = () => {
  return {
    select: () => ({
      from: () => ({
        where: () => ({
          get: async () => null,
        }),
        limit: () => [],
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: async () => [{}],
      }),
    }),
    update: () => ({
      set: () => ({
        where: async () => ({}),
      }),
    }),
    delete: () => ({
      where: async () => ({}),
    }),
  }
}

export default getDbClient
