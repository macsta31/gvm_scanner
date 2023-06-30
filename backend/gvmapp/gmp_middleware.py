from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp

class GmpMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.path = '/run/gvmd/gvmd.sock'
        self.connection = None
        self.gmp = None

    def __call__(self, request):
        self.connection = UnixSocketConnection(path=self.path)
        self.gmp = Gmp(connection=self.connection)

        username = 'admin'
        password = 'd268db17-a541-474e-93dd-6066926d9388'
        self.gmp.connect()

        request.gmp = self.gmp

        response = self.get_response(request)

        # Disconnect the gmp instance manually when no longer needed
        # self.gmp.disconnect()

        return response


