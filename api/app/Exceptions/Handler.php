<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;

class Handler extends ExceptionHandler {
    /**
     * A lista de tipos de exceções que não devem ser reportados.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A lista de campos que nunca devem ser exibidos em flashes de validação.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Registra os callbacks para tratamento de exceções.
     */
    public function register(): void {
        //
    }

    /**
     * Sobrescreve o render para capturar ValidationException
     * e retornar sempre JSON em APIs, em vez de redirecionar para "/".
     */
    public function render($request, Throwable $exception) {
        if ($exception instanceof ValidationException) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $exception->errors(),
            ], 422);
        }

        return parent::render($request, $exception);
    }

    protected function unauthenticated($request, AuthenticationException $exception) {
        if ($request->is('api/v1/*')) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        return parent::unauthenticated($request, $exception);
    }
}