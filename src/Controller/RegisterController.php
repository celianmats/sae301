<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class RegisterController extends AbstractController
{
    private $params;

    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
    }

    #[Route('/register', name: 'register')]
    public function register(Request $request): Response
    {
        if ($request->isMethod('POST')) {
            // Récupérer les données du formulaire
            $email = $request->request->get('email');
            $password = password_hash($request->request->get('password'), PASSWORD_BCRYPT);

            // Charger les données existantes
            $filePath = $this->params->get('kernel.project_dir') . '/data/users.json';
            $data = json_decode(file_get_contents($filePath), true);

            // Ajouter les nouvelles données
            $data[] = ['email' => $email, 'password' => $password];

            // Enregistrer les données dans le fichier JSON
            file_put_contents($filePath, json_encode($data));

            // Rediriger l'utilisateur vers une page de confirmation
            return $this->redirectToRoute('login'); // À supposer que vous ayez une route nommée 'confirmation'
        }

        return $this->render('register/index.html.twig');
    }
}


